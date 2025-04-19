import Interview, { InterviewDoc, InterviewStatus, InterviewType } from '@/infra/database/mongo/schema/interviewSchema';

interface CreateInterviewDto {
  jobId: string;
  companyId: string;
  candidateId: string;
  scheduledTime: Date;
  interviewType: InterviewType;
  locationOrLink?: string;
  title?: string;
  interviewers?: string[];
  duration?: number;
  round?: number;
}

interface RescheduleInterviewDto {
  interviewId: string;
  newScheduledTime: Date;
  reason?: string;
}

interface UpdateInterviewStatusDto {
  interviewId: string;
  status: InterviewStatus;
  feedback?: string;
  technicalScore?: number;
  communicationScore?: number;
  cultureFitScore?: number;
  feedbackRating?: number;
}

class InterviewRepository {
  /**
   * Create a new interview
   */
  async createInterview(dto: CreateInterviewDto): Promise<InterviewDoc> {
    try {
      // Check if there's any scheduling conflict for the candidate
      const existingInterview = await Interview.findOne({
        candidateId: dto.candidateId,
        scheduledTime: dto.scheduledTime,
        status: { $nin: [InterviewStatus.CANCELLED, InterviewStatus.COMPLETED] }
      });

      if (existingInterview) {
        throw new Error('Candidate already has an interview scheduled at this time');
      }

      // Create the interview
      const interview = Interview.build({
        ...dto,
        status: InterviewStatus.SCHEDULED
      });

      await interview.save();
      return interview;
    } catch (error) {
      throw error
    }
  }


  async rescheduleInterview(dto: RescheduleInterviewDto): Promise<InterviewDoc> {
    try {
      const interview = await Interview.findById(dto.interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }

      if (interview.status === InterviewStatus.COMPLETED) {
        throw new Error('Cannot reschedule a completed interview');
      }

      if (interview.status === InterviewStatus.CANCELLED) {
        throw new Error('Cannot reschedule a cancelled interview');
      }

      // Check for scheduling conflicts
      const existingInterview = await Interview.findOne({
        _id: { $ne: dto.interviewId },
        candidateId: interview.candidateId,
        scheduledTime: dto.newScheduledTime,
        status: { $nin: [InterviewStatus.CANCELLED, InterviewStatus.COMPLETED] }
      });

      if (existingInterview) {
        throw new Error('Candidate already has an interview scheduled at the new time');
      }

      // Update the interview
      interview.scheduledTime = dto.newScheduledTime;
      interview.status = InterviewStatus.RESCHEDULED;
      
      if (dto.reason) {
        interview.notes = interview.notes 
          ? `${interview.notes}\nRescheduled: ${dto.reason}`
          : `Rescheduled: ${dto.reason}`;
      }

      await interview.save();
      return interview;
    } catch (error) {
      throw error
    }
  }

  /**
   * Update interview status and related feedback
   */
  async updateInterviewStatus(dto: UpdateInterviewStatusDto): Promise<InterviewDoc> {
    try {
      const interview = await Interview.findById(dto.interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }

      // Validate status transitions
      if (interview.status === InterviewStatus.CANCELLED) {
        throw new Error('Cannot update status of a cancelled interview');
      }

      if (interview.status === InterviewStatus.COMPLETED && dto.status !== InterviewStatus.CANCELLED) {
        throw new Error('Cannot modify status of a completed interview except to cancel');
      }

      // Update interview status and feedback
      interview.status = dto.status;
      
      if (dto.feedback) {
        interview.feedback = dto.feedback;
      }

      if (dto.status === InterviewStatus.COMPLETED) {
        // Update scores only if interview is marked as completed
        if (dto.technicalScore !== undefined) {
          interview.technicalScore = dto.technicalScore;
        }
        if (dto.communicationScore !== undefined) {
          interview.communicationScore = dto.communicationScore;
        }
        if (dto.cultureFitScore !== undefined) {
          interview.cultureFitScore = dto.cultureFitScore;
        }
        if (dto.feedbackRating !== undefined) {
          interview.feedbackRating = dto.feedbackRating;
        }
      }

      await interview.save();
      return interview;
    } catch (error) {
      throw error
    }
  }

  async getInterviewById(interviewId: string): Promise<InterviewDoc | null> {
    try {
      return await Interview.findById(interviewId)
        .populate('jobId')
        .populate('companyId')
        .populate('candidateId')
        .populate('interviewers');
    } catch (error) {
      throw error
    }
  }
}

export default InterviewRepository;