import { CuisineType } from './enum';
import { Countries } from './enum';

export const CuisineMap: Record<CuisineType, string> = {
  [CuisineType.Continental]: CuisineType.Continental,
  [CuisineType.Chinese]: CuisineType.Chinese,
  [CuisineType.Egyptian]: CuisineType.Egyptian,
  [CuisineType.Filipino]: CuisineType.Filipino,
  [CuisineType.Indian]: CuisineType.Indian,
  [CuisineType.Italian]: CuisineType.Italian,
  [CuisineType.Korean]: CuisineType.Korean,
  [CuisineType.Lebanese]: CuisineType.Lebanese,
  [CuisineType.Pakistani]: CuisineType.Pakistani,
  [CuisineType.Thai]: CuisineType.Thai,
  [CuisineType.Vietnemese]: CuisineType.Vietnemese,
  [CuisineType.Western]: CuisineType.Western,
};

export const CountryMap: Record<Countries, string> = {
  [Countries.Australia]: Countries.Australia,
  [Countries.NewZealand]: Countries.NewZealand,
  [Countries.Singapore]: Countries.Singapore,
};
