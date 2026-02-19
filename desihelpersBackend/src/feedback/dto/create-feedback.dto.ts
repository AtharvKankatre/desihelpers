export class CreateFeedbackDto {
  seekerId: string;
  reviewerId?: string;
  reviewerName?: string;
  rating: number;
  feedback: string;
}
