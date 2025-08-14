import { NextResponse } from 'next/server';
import { getFacilitators, addFacilitator, updateFacilitator, deleteFacilitator as deleteFacilitatorFromDb, Facilitator } from "@/lib/data";

// Disable caching for this route.
export const revalidate = 0;

export async function GET() {
  try {
    const facilitators = await getFacilitators();
    return NextResponse.json(facilitators);
  } catch (error: any) {
    console.error('Error fetching facilitators:', error);
    return NextResponse.json({ error: 'An error occurred while fetching facilitators.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const facilitatorData: Omit<Facilitator, "id"> = await request.json();
        
        if (!facilitatorData.fullName || !facilitatorData.email || !facilitatorData.gender) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newFacilitator = await addFacilitator(facilitatorData);
        return NextResponse.json(newFacilitator, { status: 201 });

    } catch (error: any) {
        console.error('Error adding facilitator:', error);
        if (error.message.includes('already exists')) {
             return NextResponse.json({ error: error.message }, { status: 409 });
        }
        return NextResponse.json({ error: 'An error occurred while adding the facilitator.' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, ...updateData } = await request.json();
        if (!id || !updateData) {
            return NextResponse.json({ error: 'Missing ID or update data' }, { status: 400 });
        }
        await updateFacilitator(id, updateData);
        return NextResponse.json({ message: 'Facilitator updated successfully' });
    } catch (error: any) {
        console.error('Error updating facilitator:', error);
        if (error.message.includes('already exists')) {
             return NextResponse.json({ error: error.message }, { status: 409 });
        }
        return NextResponse.json({ error: 'An error occurred while updating the facilitator.' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }
        await deleteFacilitatorFromDb(id);
        return NextResponse.json({ message: 'Facilitator deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting facilitator:', error);
        return NextResponse.json({ error: 'An error occurred while deleting the facilitator.' }, { status: 500 });
    }
}
