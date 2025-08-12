import type { NextApiRequest, NextApiResponse } from 'next';
import { getFacilitators, Facilitator } from '@/lib/data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Facilitator[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const facilitators = await getFacilitators();
      res.status(200).json(facilitators);
    } catch (error: any) {
      console.error('Error fetching facilitators:', error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching facilitators.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
