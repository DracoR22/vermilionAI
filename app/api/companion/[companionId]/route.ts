import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function PATCH(req: Request, {params}: {params: {companionId: string}}) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    if(!params.companionId) {
        return new NextResponse('Companion ID is required', { status: 400 })
    }

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!src || !name || !description || !instructions || !seed || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    };

    const isPro = await checkSubscription()

    if(!isPro) {
      return new NextResponse('Pro subscription required', { status: 403 })
    }


    const companion = await prismadb.companion.update({
        where: {
            id: params.companionId,
            userId: user.id
        },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export async function DELETE (req: Request, {params}: {params: {companionId: string}}) {

  const user = await currentUser()
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if(!params.companionId || typeof params.companionId !== 'string') {
    return new NextResponse('Companion ID is required')
  }

  const companion = await prismadb.companion.delete({
    where: {
      id: params.companionId,
      userId: user.id
    }
  })

  return NextResponse.json(companion)
}