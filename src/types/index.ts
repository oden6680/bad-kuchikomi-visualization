export interface Review {
  review_id: string;
  overall_rating: string;
  overall_rating_detail: string;
  review_content: string;
  lecture: string;
  lecture_detail: string;
  laboratory_seminar: string;
  laboratory_seminar_detail: string;
  career: string;
  career_detail: string;
  access_location: string;
  access_location_detail: string;
  facilities: string;
  facilities_detail: string;
  friendship_romance: string;
  friendship_romance_detail: string;
  student_life: string;
  student_life_detail: string;
  department_curriculum: string;
  department_curriculum_detail: string;
  gender_ratio?: string;
  gender_ratio_detail?: string;
  motivation?: string;
  motivation_detail?: string;
  career_path?: string;
  career_path_detail?: string;
}

export interface University {
  university_name: string;
  url: string;
  review_url: string;
  reviews: Review[];
}

export type UniversityReviews = University[];
