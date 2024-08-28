"use server";

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

import { SupplierType } from "@/app/join/supplier/page";
import { Country } from "@/components/BrandPage/MapsAndChart/MapChart";
import { supabase } from "@/lib/supabaseClient";
let grievancesCountGlobal: number = 0;
let totalTagsScoreGlobal = 0;
let totalTagsCountGlobal = 0;
export async function getMapData(
  startDate: Date,
  endDate: Date
): Promise<Country[]> {
  // Initialize Supabase client

  // Fetch suppliers data from Supabase
  const { data, error } = await supabase
    .from('supplier')
    .select('country_name, coordinates');

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    throw new Error('Could not fetch data from Supabase');
  }

  // Group the data by country and structure the result
  const countryMap = data.reduce((acc, supplier) => {
    if (!acc[supplier.country_name]) {
      acc[supplier.country_name] = {
        name: supplier.country_name,
        suppliers: 0,
        coordinates: [],
      };
    }
    acc[supplier.country_name].suppliers += 1;
    acc[supplier.country_name].coordinates.push(
      supplier.coordinates.split(',').map(Number)
    );
    return acc;
  }, {});

  // Convert the countryMap object into an array
  const result = Object.values(countryMap);

  return result as Country[];
}

export const getTotalRecommendationScore = async (): Promise<number> => {
  const { orgId } = auth();

  const companyId = 7; // Hardcoded company ID

  // Fetch company_name from Supabase using the hardcoded company_id
  const { data, error } = await supabase
    .from('supplier')
    .select('company_name')
    .eq('company_id', companyId)
    .single();

  if (error) {
    console.error("Error fetching company name:", error);
    // Handle error appropriately in your application
  }

  const company_name = data?.company_name || "Unknown Company";

  // Step 1: Fetch all distinct tags from the `tag` table using the `tag_title` column
  const { data: tagData, error: tagError } = await supabase
    .from('tag')
    .select('tag_title')
    .order('tag_title', { ascending: true });

  if (tagError) {
    console.error('Error fetching tags:', tagError);
    throw tagError;
  }

  if (!tagData || tagData.length === 0) {
    console.error('No tags found');
    return 0;  // Return 0 if no tags are found
  }

  // Filter out null or undefined tag titles
  const tags = tagData
    .map((row: { tag_title: string | null }) => row.tag_title)
    .filter((tag): tag is string => tag !== null && tag !== undefined);

  let totalTagsScore = 0;
  let totalTagsCount = tags.length;

  // Step 2: For each tag, fetch and calculate the weighted average
  for (const tag of tags) {
    const { data: responseData, error: responseError } = await supabase
      .from('response')
      .select('response_rating')
      .eq('tag', tag); // Use the tag column in the response table

    if (responseError) {
      console.error(`Error fetching responses for tag ${tag}:`, responseError);
      continue;
    }

    if (!responseData || responseData.length === 0) {
      console.warn(`No responses found for tag ${tag}`);
      continue;
    }

    const validResponses = responseData.filter(
      (row: { response_rating: any }) =>
        row.response_rating !== null && Array.isArray(row.response_rating)
    );

    if (validResponses.length === 0) {
      continue;
    }

    let tagTotalCount = 0;
    let tagTotalScore = 0;

    for (const response of validResponses) {
      const jsonbArray = response.response_rating;

      for (const item of jsonbArray) {
        if (typeof item.value === 'number') {
          tagTotalCount += item.count;
          tagTotalScore += item.score * item.count;
        }
      }
    }

    const weightedAverage = tagTotalCount ? Math.round(tagTotalScore / tagTotalCount) : 0;
    totalTagsScore += weightedAverage;
  }

  // Calculate the recommendation score
  const recommendationScore = totalTagsCount > 0 
    ? Math.round(totalTagsScore / totalTagsCount) 
    : 0;

  return recommendationScore;
};


export const getTotalSuppliers = async (): Promise<number> => {
  // Fetch the total count of companies
  const { count, error } = await supabase
    .from('supplier')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching total suppliers:', error);
    throw new Error('Could not fetch total suppliers');
  }

  return count ?? 0;
};

export const getWorkersOverTime = async (
  startDate: Date,
  endDate: Date
): Promise<{ date: Date; value: number }[]> => {
  const { orgId } = auth();

  // -----------------------------------------------------------------------------
  // LOGIC FOR EXTRACTING WORKERS OVER TIME FROM DATABASE GOES HERE. USE ORG_ID
  // -----------------------------------------------------------------------------

  return [
    { date: new Date(2022, 4), value: 30 },
    { date: new Date(2022, 5), value: 50 },
    { date: new Date(2022, 6), value: 40 },
    { date: new Date(2022, 7), value: 60 },
    { date: new Date(2022, 8), value: 70 },
  ];
};

export const getRecommendationScoreOverTime = async (
  startDate: Date,
  endDate: Date
): Promise<{ date: Date; value: number }[]> => {
  const { orgId } = auth();

  // -----------------------------------------------------------------------------
  // LOGIC FOR EXTRACTING RECOMMENDATION SCORE OVER TIME FROM DATABASE GOES HERE. USE ORG_ID
  // -----------------------------------------------------------------------------

  return [
    { date: new Date(2022, 4), value: 20 },
    { date: new Date(2022, 5), value: 30 },
    { date: new Date(2022, 6), value: 50 },
    { date: new Date(2022, 7), value: 40 },
    { date: new Date(2022, 8), value: 60 },
  ];
};

export const getTotalRegisteredWorkersRate = async (
  startDate: Date,
  endDate: Date
): Promise<number> => {
  const { orgId } = auth();

  // -----------------------------------------------------------------------------
  // LOGIC FOR EXTRACTING RECOMMENDATION SCORE OVER TIME FROM DATABASE GOES HERE. USE ORG_ID
  // -----------------------------------------------------------------------------

  return 40;
};

export type MetricType = "grievances" | "comments" | "photos";

export const getTotalMetric = async (
  startDate: Date,
  endDate: Date,
  metricType: MetricType
): Promise<number> => {
  let result: number;

  // Although startDate and endDate are passed, they are not used because there's no date column in the table

  switch (metricType) {
    case "grievances":
      // Get the total count for grievances (where response_is_grievance is True)
      const { count: grievancesCount } = await supabase
        .from("response")
        .select("*", { count: "exact" })
        .eq("response_is_grievance", true);
      
      grievancesCountGlobal = grievancesCount || 0; // Assign to global variable
      result = grievancesCountGlobal;
      break;

    case "comments":
      // Get the total count for comments (where response_is_grievance is False and response_text is not null)
      const { count: commentsCount } = await supabase
        .from("response")
        .select("*", { count: "exact" })
        .eq("response_is_grievance", false)
        .not("response_text", "is", null);
      
      result = commentsCount || 0;
      break;
      
    case "photos":
      // Get the total count for photos (where response_text contains a URL)
      const { count: photosCount } = await supabase
        .from("response")
        .select("*", { count: "exact" })
        .like("response_text", "%http%");
      
      result = photosCount || 0;
      break;

    default:
      throw new Error("Invalid metric type");
  }

  return result;
};

type Score = {
  topic: string;
  value: number;
};

export type AnnualAssessmentResult = {
  totalAnswers: number;
  averageScore: number;
  scores: { topic: string; value: number }[];
};

export type AnnualAssessmentResult = {
  totalAnswers: number;
  averageScore: number;
  scores: { topic: string; value: number }[];
};

export const getAnnualAssessment = async (
  startDate: Date,
  endDate: Date
): Promise<AnnualAssessmentResult> => {
  const { orgId } = auth(); // Use the orgId for filtering if needed

  // Step 1: Fetch all distinct tags from the `tag` table using the `tag_title` column
  const { data: tagData, error: tagError } = await supabase
    .from('tag')
    .select('tag_title')
    .order('tag_title', { ascending: true });

  if (tagError) {
    console.error('Error fetching tags:', tagError);
    throw tagError;
  }

  if (!tagData || tagData.length === 0) {
    console.error('No tags found');
    return {
      totalAnswers: 0,
      averageScore: 0,
      scores: [],
    };
  }

  // Filter out null or undefined tag titles
  const tags = tagData
    .map((row: { tag_title: string | null }) => row.tag_title)
    .filter((tag): tag is string => tag !== null && tag !== undefined);

  let totalAnswers = 0;
  let totalScoreSum = 0;
  const scores: { topic: string; value: number }[] = [];

  // Step 2: For each tag, fetch and calculate the weighted average
  for (const tag of tags) {
    const { data: responseData, error: responseError } = await supabase
      .from('response')
      .select('response_rating')
      .eq('tag', tag); // Use the tag column in the response table

    if (responseError) {
      console.error(`Error fetching responses for tag ${tag}:`, responseError);
      continue;
    }

    if (!responseData || responseData.length === 0) {
      console.warn(`No responses found for tag ${tag}`);
      continue;
    }

    const validResponses = responseData.filter(
      (row: { response_rating: any }) =>
        row.response_rating !== null && Array.isArray(row.response_rating)
    );

    if (validResponses.length === 0) {
      continue;
    }

    let tagTotalCount = 0;
    let tagTotalScore = 0;

    for (const response of validResponses) {
      const jsonbArray = response.response_rating;

      for (const item of jsonbArray) {
        if (typeof item.value === 'number') {
          tagTotalCount += item.count;
          tagTotalScore += item.score * item.count;
        }
      }
    }

    const weightedAverage = tagTotalCount ? Math.round(tagTotalScore / tagTotalCount) : 0;

    totalAnswers += tagTotalCount;
    totalScoreSum += tagTotalScore;

    // Round the weighted average to a whole number
    scores.push({ topic: tag, value: weightedAverage });
  }

  // Calculate the average score and round it to a whole number
  const averageScore = totalAnswers > 0 ? Math.round(totalScoreSum / totalAnswers) : 0;

  // Return the final results
  return {
    totalAnswers,
    averageScore,
    scores,
  };
};

// // Define the AnnualAssessmentResult type if not already defined
// type AnnualAssessmentResult = {
//   totalAnswers: number;
//   averageScore: number;
//   scores: { topic: string; value: number }[];
// };
type GrievanceTopic = {
  topic: string;
  responded: number;
  resolved: number;
  unresolved: number;
};

export type GrievanceStatusResult = {
  totalGrievances: number;
  responseRate: number;
  resolutionRate: number;
  topics: GrievanceTopic[];
};

export const getGrievanceStatus = async (
  startDate: Date,
  endDate: Date
): Promise<GrievanceStatusResult> => {
  const { orgId } = auth();

  // Fetch the grievances count
  await getTotalMetric(startDate, endDate, "grievances");

  // Query the tag table to get all tag titles
  const { data: tagsData, error: tagsError } = await supabase
    .from('tag')
    .select('tag_title');

  if (tagsError) {
    console.error('Error fetching tags:', tagsError);
    return {
      totalGrievances: grievancesCountGlobal,
      responseRate: 85,
      resolutionRate: 75,
      topics: [], // Return empty array if there's an error
    };
  }

  // Fetch response status counts for each tag
  const topics = await Promise.all(
    tagsData.map(async (tag) => {
      const { data: responseData, error: responseError } = await supabase
        .from('response')
        .select('response_grievance_status', { count: 'exact' })
        .eq('tag', tag.tag_title);

      if (responseError) {
        console.error('Error fetching response data:', responseError);
        return {
          topic: tag.tag_title,
          responded: 0,
          resolved: 0,
          unresolved: 0,
        };
      }

      const responded = responseData.filter(item => item.response_grievance_status == 'responded').length;
      const resolved = responseData.filter(item => item.response_grievance_status === 'resolved').length;
      const unresolved = responseData.filter(item => item.response_grievance_status === 'unresolved').length;

      return {
        topic: tag.tag_title,
        responded,
        resolved,
        unresolved,
      };
    })
  );

  // Return the result
  return {
    totalGrievances: grievancesCountGlobal,
    responseRate: 85,
    resolutionRate: 75,
    topics,
  };
};


type LearningRateTopic = {
  topic: string;
  completionRate: number;
};

export type WorkersLearningRateResult = {
  hotTopic: string;
  topics: LearningRateTopic[];
};

export const getWorkersLearningRate = async (
  startDate: Date,
  endDate: Date
): Promise<WorkersLearningRateResult> => {
  const { orgId } = auth(); // Assume auth() is a function that gets authentication context

  // Query the database to get the total participants and replies for each tag
  const { data, error } = await supabase
    .from('question')
    .select('tag, question_participants, question_replied')
    .gte('question_created_date', startDate.toISOString())
    .lte('question_created_date', endDate.toISOString());

  if (error) {
    console.error('Error fetching data:', error);
    return {
      hotTopic: '',
      topics: []
    };
  }

  // Calculate the total participants and replies for each tag
  const tagTotals: { [key: string]: { participants: number; replies: number } } = {};

  data.forEach(row => {
    const { tag, question_participants, question_replied } = row;
    if (tag) {
      if (!tagTotals[tag]) {
        tagTotals[tag] = { participants: 0, replies: 0 };
      }
      tagTotals[tag].participants += question_participants || 0;
      tagTotals[tag].replies += question_replied || 0;
    }
  });

  // Calculate the completion rate for each tag
  const topics = Object.keys(tagTotals).map(tag => {
    const { participants, replies } = tagTotals[tag];
    // Ensure completionRate does not exceed 100
    const completionRate = participants > 0 ? Math.min((replies / participants) * 100, 100) : 0;
    return { topic: tag, completionRate: parseFloat(completionRate.toFixed(2)) };
  });

  const sortedTopics = topics.sort(
    (a, b) => b.completionRate - a.completionRate
  );

  const hotTopic = sortedTopics.length > 0 ? sortedTopics[0].topic : '';

  return {
    hotTopic,
    topics: sortedTopics,
  };
};

export type Supplier = {
  id: string;
  slug: string | null;
  name: string;
  country: string;
  status: string;
  employees: number;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  // Get all organizations and this user object
  let orgs = (await clerkClient.organizations.getOrganizationList())
    .data as SupplierType[];
  const user = await currentUser();

  // Filter all the suppliers organizations
  orgs = orgs.filter(
    (org) =>
      org.publicMetadata.verified && org.publicMetadata.type === "supplier"
  );

  // Get a list of all the organization purchased by the current user and construct a list of (purchased, not-purchased) suppliers.
  const listOfPurchasedSuppliers: string[] =
    (user?.privateMetadata?.purchased_suppliers as unknown as string[]) || [];

  let suppliers = orgs.map((org) => ({
    id: org.id,
    slug: org.slug || null,
    name: org.name,
    country:
      typeof org.publicMetadata.country === "string"
        ? org.publicMetadata.country
        : "Not available",
    employees:
      typeof org.publicMetadata.employees === "number"
        ? org.publicMetadata.employees
        : 0,
    status: listOfPurchasedSuppliers.includes(org.id)
      ? "purchased"
      : "not-purchased",
  }));

  return suppliers;
};
