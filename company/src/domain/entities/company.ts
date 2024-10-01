export class CompanyEntity {
    public readonly name: string;
    public readonly industry?: string;
    public readonly description: string;
    public readonly organizationSize: string;
    public readonly organizationType: string;
    public readonly logo?: string;
    public readonly website?: string;
    public readonly location: string;
    public readonly owner: string;
    public readonly urlAddress: string;
  
    constructor(
      name: string,
      description: string,
      organizationSize: string,
      organizationType: string,
      location: string,
      owner: string,
      urlAddress: string,
      industry?: string,
      logo?: string,
      website?: string
    ) {
      this.name = name;
      this.industry = industry;
      this.description = description;
      this.organizationSize = organizationSize;
      this.organizationType = organizationType;
      this.logo = logo;
      this.website = website;
      this.location = location;
      this.owner = owner;
      this.urlAddress = urlAddress;
    }
  }
  