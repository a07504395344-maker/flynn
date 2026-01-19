
export enum AppView {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
  CAMERA = 'CAMERA',
  RESULTS = 'RESULTS',
  PROFILE = 'PROFILE'
}

export interface CatBreed {
  name: string;
  description: string;
  personality: string;
  priceRange: string;
  affectionLevel: number;
  energyLevel: number;
  matchConfidence: number;
  imageUrl: string;
}

export interface UserPet {
  id: string;
  name: string;
  breed: string;
  imageUrl: string;
}
