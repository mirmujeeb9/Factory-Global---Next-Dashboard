"use server";

import { Country } from "@/components/BrandPage/MapsAndChart/MapChart";
import { clerkClient } from "@clerk/nextjs/server";

export const getOrganizationName = async (slug: string): Promise<string> => {
  const org = await clerkClient.organizations.getOrganization({ slug: slug });
  return org.name;
};

export const getSupplierMapData = async (
  startDate: Date,
  endDate: Date,
  supplierSlug: string
): Promise<Country> => {
  const orgId = (
    await clerkClient.organizations.getOrganization({ slug: supplierSlug })
  ).id;

  return {
    name: "China",
    coordinates: [[114.0579, 22.5431]], // Coordinates for Shenzhen
  };
};

export type Comment = {
  concern: string;
  comment: string;
  date: string;
};

export const getComments = async (
  startDate: Date,
  endDate: Date,
  supplierSlug: string
): Promise<Comment[]> => {
  const orgId = (
    await clerkClient.organizations.getOrganization({ slug: supplierSlug })
  ).id;

  return [
    {
      concern: "Mental health",
      comment: "Top comment",
      date: "14th July, 2024",
    },
    {
      concern: "Mental health",
      comment: "Top comment",
      date: "14th July, 2024",
    },
    {
      concern: "Mental health",
      comment: "Top comment",
      date: "14th July, 2024",
    },
    {
      concern: "Mental health",
      comment: "Top comment",
      date: "14th July, 2024",
    },
    {
      concern: "Mental health",
      comment: "Top comment",
      date: "14th July, 2024",
    },
  ];
};

export type Grievance = {
  concern: string;
  comment: string;
  status: "Resolved" | "Responded" | "Not responded";
  date: string;
};

export const getGrievances = async (
  startDate: Date,
  endDate: Date,
  supplierSlug: string
): Promise<Grievance[]> => {
  const orgId = (
    await clerkClient.organizations.getOrganization({ slug: supplierSlug })
  ).id;

  return [
    {
      concern: "Mental health",
      comment: "Grievance comment 1",
      status: "Resolved",
      date: "14th July, 2024",
    },
    {
      concern: "Work conditions",
      comment: "Grievance comment 2",
      status: "Responded",
      date: "15th July, 2024",
    },
    {
      concern: "Salary issues",
      comment: "Grievance comment 3",
      status: "Not responded",
      date: "16th July, 2024",
    },
    {
      concern: "Work hours",
      comment: "Grievance comment 4",
      status: "Resolved",
      date: "17th July, 2024",
    },
    {
      concern: "Safety concerns",
      comment: "Grievance comment 5",
      status: "Responded",
      date: "18th July, 2024",
    },
  ];
};



export type WorkerComment = {
  concern: string;
  comment: string;
  bookmark: boolean;
  date: string;
};

export const getWorkerComments = async (
  startDate: Date,
  endDate: Date,
  supplierSlug: string
): Promise<WorkerComment[]> => {
  const orgId = (
    await clerkClient.organizations.getOrganization({ slug: supplierSlug })
  ).id;

  return [
    {
      concern: "Mental health",
      comment: "Worker comment 1",
      bookmark: true,
      date: "14th July, 2024",
    },
    {
      concern: "Work conditions",
      comment: "Worker comment 2",
      bookmark: false,
      date: "15th July, 2024",
    },
    {
      concern: "Salary issues",
      comment: "Worker comment 3",
      bookmark: true,
      date: "16th July, 2024",
    },
    {
      concern: "Work hours",
      comment: "Worker comment 4",
      bookmark: false,
      date: "17th July, 2024",
    },
    {
      concern: "Safety concerns",
      comment: "Worker comment 5",
      bookmark: true,
      date: "18th July, 2024",
    },
  ];
};
