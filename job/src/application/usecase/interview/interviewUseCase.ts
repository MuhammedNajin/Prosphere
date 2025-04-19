import { Interview, InterviewDoc, InterviewStatus, InterviewType } from './models/Interview';
import InterviewRepository from './repositories/InterviewRepository';
import { sendInterviewInvitation, sendRescheduleNotification, sendStatusUpdateNotification } from '../services/NotificationService';
import { addToCalendar } from '../services/CalendarService';
import { UserRole } from '../shared/types/enums';


interface InterviewScheduleRequest {
  jobId: string;
  companyId: string;
  candidateId: string;
  scheduledTime: Date;
  interviewType: InterviewType;
  locationOrLink: string;
  interviewers: string[];
  duration: number;
  title: string;
  round: number;
}

interface RescheduleRequest {
  interviewId: string;
  newScheduledTime: Date;
  reason: string;
  requestedBy: {
    userId: string;
    role: UserRole;
  };
}

interface StatusUpdateRequest {
  interviewId: string;
  status: InterviewStatus;
  feedback?: string;
  technicalScore?: number;
  communicationScore?: number;
  cultureFitScore?: number;
  feedbackRating?: number;
  updatedBy: string;
}

class InterviewUseCase {
  private repository: InterviewRepository;

  constructor() {
    this.repository = new InterviewRepository();
  }
  
  async scheduleInterview(request: InterviewScheduleRequest): Promise<InterviewDoc> {
    try {
      // Validate scheduling time
      if (new Date(request.scheduledTime) < new Date()) {
        throw new Error('Cannot schedule interview in the past');
      }

      // Create interview
      const interview = await this.repository.createInterview({
        ...request,
        status: InterviewStatus.SCHEDULED
      });

      // Send notifications
      await Promise.all([
        // Send to candidate
        sendInterviewInvitation({
          to: interview.candidateId,
          interview: interview,
          type: 'candidate'
        }),
        ...interview.interviewers.map(interviewer =>
          sendInterviewInvitation({
            to: interviewer,
            interview: interview,
            type: 'interviewer'
          })
        )
      ]);

      await addToCalendar({
        interview,
        attendees: [...interview.interviewers, interview.candidateId]
      });

      return interview;
    } catch (error) {
      throw new Error(`Failed to schedule interview: ${error.message}`);
    }
  }

  async rescheduleInterview(request: RescheduleRequest): Promise<InterviewDoc> {
    try {
    
      if (new Date(request.newScheduledTime) < new Date()) {
        throw new Error('Cannot reschedule interview to a past time');
      }

      const currentInterview = await this.repository.getInterviewById(request.interviewId);
      if (!currentInterview) {
        throw new Error('Interview not found');
      }

      this.validateReschedulingPermissions(request.requestedBy, currentInterview);

      const rescheduledInterview = await this.repository.rescheduleInterview({
        interviewId: request.interviewId,
        newScheduledTime: request.newScheduledTime,
        reason: request.reason
      });

      await Promise.all([
        sendRescheduleNotification({
          to: rescheduledInterview.candidateId,
          interview: rescheduledInterview,
          reason: request.reason,
          type: 'candidate'
        }),
        
        ...rescheduledInterview.interviewers.map(interviewer =>
          sendRescheduleNotification({
            to: interviewer,
            interview: rescheduledInterview,
            reason: request.reason,
            type: 'interviewer'
          })
        )
      ]);

      await addToCalendar({
        interview: rescheduledInterview,
        attendees: [...rescheduledInterview.interviewers, rescheduledInterview.candidateId],
        isUpdate: true
      });

      return rescheduledInterview;
    } catch (error) {
      throw error;
    }
  }

  async updateInterviewStatus(request: StatusUpdateRequest): Promise<InterviewDoc> {
    try {

      const currentInterview = await this.repository.getInterviewById(request.interviewId);
      if (!currentInterview) {
        throw new Error('Interview not found');
      }

      this.validateStatusUpdate(currentInterview, request.status);

      const updatedInterview = await this.repository.updateInterviewStatus({
        interviewId: request.interviewId,
        status: request.status,
        feedback: request.feedback,
        technicalScore: request.technicalScore,
        communicationScore: request.communicationScore,
        cultureFitScore: request.cultureFitScore,
        feedbackRating: request.feedbackRating
      });

      await sendStatusUpdateNotification({
        to: updatedInterview.candidateId,
        interview: updatedInterview,
        status: request.status
      });

      return updatedInterview;
    } catch (error) {
      throw error;
    }
  }

  private validateReschedulingPermissions(
    requestedBy: { userId: string; role: UserRole },
    interview: InterviewDoc
  ): void {
    const isInterviewer = interview.interviewers.includes(requestedBy.userId);
    const isCandidate = interview.candidateId === requestedBy.userId;
    const isAdmin = requestedBy.role === UserRole.ADMIN;
    const isHR = requestedBy.role === UserRole.HR;

    if (!isInterviewer && !isCandidate && !isAdmin && !isHR) {
      throw error;
    }
  }


  private validateStatusUpdate(interview: InterviewDoc, newStatus: InterviewStatus): void {
    if (interview.status === InterviewStatus.CANCELLED) {
      throw new Error('Cannot update status of a cancelled interview');
    }

    if (interview.status === InterviewStatus.COMPLETED && 
        newStatus !== InterviewStatus.CANCELLED) {
      throw new Error('Cannot modify status of a completed interview except to cancel');
    }

    if (newStatus === InterviewStatus.COMPLETED && 
        new Date(interview.scheduledTime) > new Date()) {
      throw new Error('Cannot mark future interview as completed');
    }
  }

  /**
   * Get upcoming interviews for a user
   */
  async getUpcomingInterviews(userId: string, role: UserRole): Promise<InterviewDoc[]> {
    try {
      const query = {
        status: { $nin: [InterviewStatus.CANCELLED, InterviewStatus.COMPLETED] },
        scheduledTime: { $gt: new Date() }
      };

      if (role === UserRole.CANDIDATE) {
        query['candidateId'] = userId;
      } else if (role === UserRole.INTERVIEWER) {
        query['interviewers'] = userId;
      }

      return await Interview.find(query)
        .sort({ scheduledTime: 1 })
        .populate('jobId')
        .populate('companyId')
        .populate('candidateId')
        .populate('interviewers');
    } catch (error) {
      throw error
    }
  }
}

export default InterviewUseCase;