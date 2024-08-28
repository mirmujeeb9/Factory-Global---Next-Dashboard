export interface Brand {
  claimed: boolean;
  name: string;
  domain: string;
  icon: string;
  brandId: string;
}

export interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder: string;
}

// export interface BrandPublicMetaData {
//   name: string;
//   website: string;
//   description: string;
// }

export interface DetailedBrand {
  id: string;
  name: string;
  domain: string;
  claimed: boolean;
  description: string;
  longDescription: string;
  links: {
    name: string;
    url: string;
  }[];
  logos: {
    theme: string;
    formats: {
      src: string;
      background: string | null;
      format: string;
      height: number | null;
      width: number | null;
      size: number;
    }[];
    tags: string[];
    type: string;
  }[];
  colors: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts: {
    name: string;
    type: string;
    origin: string;
    originId: string | null;
    weights: string[];
  }[];
  images: {
    formats: {
      src: string;
      background: string | null;
      format: string;
      height: number;
      width: number;
      size: number;
    }[];
    tags: string[];
    type: string;
  }[];
  qualityScore: number;
  company: {
    employees: number;
    foundedYear: number;
    industries: {
      score: number;
      id: string;
      name: string;
      emoji: string;
      parent: string | null;
      slug: string;
    }[];
    kind: string;
    location: {
      city: string;
      country: string;
      countryCode: string;
      region: string;
      state: string;
      subregion: string;
    };
  };
  isNsfw: boolean;
  urn: string;
}

export interface CreateParams {
  name: string; // Name of the organization.
  createdBy?: string | null; // The user ID for the user creating the organization. The user will become an administrator for the organization.
  slug?: string; // Slug of the organization.
  publicMetadata?: Record<string, unknown>; // Metadata saved on the organization, that is visible to both your Frontend and Backend APIs.
  privateMetadata?: Record<string, unknown>; // Metadata saved on the organization that is visible only to your Backend APIs.
}

export interface GetOrganizationListParams {
  limit?: number; // The number of results to return. Must be an integer greater than zero and less than 501.
  offset?: number; // The number of results to skip.
  query?: string; // A search query to filter organizations by.
  orderBy?:
    | "name"
    | "updated_at"
    | "members_count"
    | "-name"
    | "-updated_at"
    | "-members_count"; // The field to order by. Prefix with a - to reverse the order. Prefix with a + to list in ascending order.
}

export interface BrandFetchBrandSchema {
  id: string;
  name: string;
  domain: string;
  claimed: boolean;
  description: string;
  longDescription: string;
  links: {
    name: string;
    url: string;
  }[];
  logos: {
    theme: string;
    formats: {
      src: string;
      background: string | null;
      format: string;
      height?: number;
      width?: number;
      size: number;
    }[];
    tags: string[];
    type: string;
  }[];
  colors: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts: {
    name: string;
    type: string;
    origin: string;
    originId: string | null;
    weights: string[];
  }[];
  images: {
    formats: {
      src: string;
      background: string | null;
      format: string;
      height: number;
      width: number;
      size: number;
    }[];
    tags: string[];
    type: string;
  }[];
  qualityScore: number;
  company: {
    employees: number;
    foundedYear: number | null;
    industries: {
      score: number;
      id: string;
      name: string;
      emoji: string;
      parent: string | null;
      slug: string;
    }[];
    kind: string;
    location: {
      city: string;
      country: string;
      countryCode: string;
      region: string;
      state: string;
      subregion: string;
    };
  };
  isNsfw: boolean;
  urn: string;
}
