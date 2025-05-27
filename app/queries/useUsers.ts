'use client';

import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/getUsers';
import { useAccount } from 'wagmi';
export const useUsers = () => {
    const { address } = useAccount();
    const { data} = useQuery({
        queryKey: ['users', address],
        queryFn: () => getUser(address),
        refetchInterval: 4 * 1000,  // optional: poll every 10s
        enabled: !!address
    });
    if (data) { 
        console.log("get user data ")
        return data
    };
    return null
};
