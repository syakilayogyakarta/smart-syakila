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

// This function is no longer used as adding is handled directly in `data.ts` via server action.
// Kept for potential future direct API use.
export async function POST(request: Request) {
    try {
        const facilitatorData: Omit<Facilitator, "id"> = await request.json();
        
        if (!facilitatorData.fullName || !facilitatorData.email || !facilitatorData.gender) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newFacilitator = await addFacilitatorToDb(facilitatorData);
        return NextResponse.json(newFacilitator, { status: 201 });

    } catch (error: any) {
        console.error('Error adding facilitator:', error);
        // Check if the error is the specific 'already exists' error from our data function
        if (error.message.includes('already exists')) {
             return NextResponse.json({ error: error.message }, { status: 409 }); // 409 Conflict
        }
        return NextResponse.json({ error: error.message || 'An error occurred while adding the facilitator.' }, { status: 500 });
    }
}
