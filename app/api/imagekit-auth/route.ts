import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    const auth_params = imagekit.getAuthenticationParameters();
    return NextResponse.json(auth_params);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication of Imagekit failed" },
      { status: 500 }
    );
  }
}
