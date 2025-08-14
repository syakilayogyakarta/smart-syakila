import { NextResponse } from 'next/server';
import { getFacilitators, addFacilitator as addFacilitatorToDb, Facilitator } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const facilitators = await getFacilitators();
    return NextResponse.json(facilitators);
  } catch (error: any) {
    console.error('Error fetching facilitators:', error);
    return NextResponse.json({ error: error.message || 'An error occurred while fetching facilitators.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const facilitatorData: Omit<Facilitator, "id"> = await request.json();
        
        if (!facilitatorData.fullName || !facilitatorData.nickname || !facilitatorData.email || !facilitatorData.gender) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingFacilitators = await getFacilitators();
        if (existingFacilitators.some(f => f.email === facilitatorData.email)) {
            return NextResponse.json({ error: 'A facilitator with this email already exists.' }, { status: 409 }); // 409 Conflict
        }

        const newFacilitator = await addFacilitatorToDb(facilitatorData);
        return NextResponse.json(newFacilitator, { status: 201 });

    } catch (error: any) {
        console.error('Error adding facilitator:', error);
        return NextResponse.json({ error: error.message || 'An error occurred while adding the facilitator.' }, { status: 500 });
    }
}