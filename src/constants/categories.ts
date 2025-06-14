export const categoryNames: Record<string, string> = {
  overall_rating: "総合評価",
  lecture: "講義・授業",
  laboratory_seminar: "研究室・ゼミ",
  career: "キャリア支援",
  access_location: "アクセス・立地",
  facilities: "施設・設備",
  friendship_romance: "友人・恋愛",
  student_life: "学生生活",
};

export const shortCategoryNames: Record<string, string> = {
  overall_rating: "総合",
  lecture: "講義",
  laboratory_seminar: "研究室",
  career: "キャリア",
  access_location: "アクセス",
  facilities: "施設",
  friendship_romance: "友人",
  student_life: "学生生活",
};

export const ratingCategories = [
  "overall_rating",
  "lecture",
  "laboratory_seminar",
  "career",
  "access_location",
  "facilities",
  "friendship_romance",
  "student_life",
] as const;

export const universityColors = [
  "#1976d2",
  "#f44336",
  "#4caf50",
  "#ff9800",
];
