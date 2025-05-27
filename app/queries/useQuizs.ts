"use client";

import { useQuery } from "@tanstack/react-query";
import { getQuizs } from "../api/getQuizs";

export const useQuizs = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getQuizs(),
    refetchInterval: 4 * 1000, // optional: poll every 4s
  });
  if (data) {
    console.log("getall quiz data ");
    console.log(data);
    return data;
  }
  return null;
};
