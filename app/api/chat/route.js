// import { google } from "@ai-sdk/google";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import { generateText } from "ai";
import { streamText } from "ai";
import { createOllama, ollama } from "ollama-ai-provider";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const data = [
  {
    id: 35,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "001",
    maxCapacity: 2,
    regularPrice: 250,
    discount: 0,
    description:
      "Discover the ultimate luxury getaway for couples in the cozy wooden cabin 001. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate retreat. Inside, enjoy modern high-quality wood interiors, a comfortable seating area, a fireplace and a fully-equipped kitchen. The plush king-size bed, dressed in fine linens guarantees a peaceful nights sleep. Relax in the spa-like shower and unwind on the private deck with hot tub.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg",
  },
  {
    id: 36,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "002",
    maxCapacity: 2,
    regularPrice: 350,
    discount: 25,
    description:
      "Escape to the serenity of nature and indulge in luxury in our cozy cabin 002. Perfect for couples, this cabin offers a secluded and intimate retreat in the heart of a picturesque forest. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace and a fully-equipped kitchen. The luxurious bedroom features a plush king-size bed and spa-like shower. Relax on the private deck with hot tub and take in the beauty of nature.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-002.jpg",
  },
  {
    id: 37,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "003",
    maxCapacity: 4,
    regularPrice: 300,
    discount: 0,
    description:
      "Experience luxury family living in our medium-sized wooden cabin 003. Perfect for families of up to 4 people, this cabin offers a comfortable and inviting space with all modern amenities. Inside, you will find warm and inviting interiors crafted from high-quality wood, a comfortable living area, a fireplace, and a fully-equipped kitchen. The bedrooms feature plush beds and spa-like bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-003.jpg",
  },
  {
    id: 38,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "004",
    maxCapacity: 4,
    regularPrice: 500,
    discount: 50,
    description:
      "Indulge in the ultimate luxury family vacation in this medium-sized cabin 004. Designed for families of up to 4, this cabin offers a sumptuous retreat for the discerning traveler. Inside, the cabin boasts of opulent interiors crafted from the finest quality wood, a comfortable living area, a fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-inspired en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-004.jpg",
  },
  {
    id: 39,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "005",
    maxCapacity: 6,
    regularPrice: 350,
    discount: 0,
    description:
      "Enjoy a comfortable and cozy getaway with your group or family in our spacious cabin 005. Designed to accommodate up to 6 people, this cabin offers a secluded retreat in the heart of nature. Inside, the cabin features warm and inviting interiors crafted from quality wood, a living area with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. Step outside to your private deck and take in the natural surroundings while relaxing in your own hot tub.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-005.jpg",
  },
  {
    id: 40,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "006",
    maxCapacity: 6,
    regularPrice: 800,
    discount: 100,
    description:
      "Experience the epitome of luxury with your group or family in our spacious wooden cabin 006. Designed to comfortably accommodate up to 6 people, this cabin offers a lavish retreat in the heart of nature. Inside, the cabin features opulent interiors crafted from premium wood, a grand living area with fireplace, and a fully-equipped gourmet kitchen. The bedrooms are adorned with plush beds and spa-like en-suite bathrooms. Step outside to your private deck and soak in the natural surroundings while relaxing in your own hot tub.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-006.jpg",
  },
  {
    id: 41,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "007",
    maxCapacity: 8,
    regularPrice: 600,
    discount: 100,
    description:
      "Accommodate your large group or multiple families in the spacious and grand wooden cabin 007. Designed to comfortably fit up to 8 people, this cabin offers a secluded retreat in the heart of beautiful forests and mountains. Inside, the cabin features warm and inviting interiors crafted from quality wood, multiple living areas with fireplace, and a fully-equipped kitchen. The bedrooms are comfortable and equipped with en-suite bathrooms. The cabin has a private deck with a hot tub and outdoor seating area, perfect for taking in the natural surroundings.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-007.jpg",
  },
  {
    id: 42,
    created_at: "2024-01-28T12:51:33.57276+00:00",
    name: "008",
    maxCapacity: 10,
    regularPrice: 1400,
    discount: 0,
    description:
      "Experience the epitome of luxury and grandeur with your large group or multiple families in our grand cabin 008. This cabin offers a lavish retreat that caters to all your needs and desires. The cabin features an opulent design and boasts of high-end finishes, intricate details and the finest quality wood throughout. Inside, the cabin features multiple grand living areas with fireplaces, a formal dining area, and a gourmet kitchen that is a chef's dream. The bedrooms are designed for ultimate comfort and luxury, with plush beds and en-suite spa-inspired bathrooms. Step outside and immerse yourself in the beauty of nature from your private deck, featuring a luxurious hot tub and ample seating areas for ultimate relaxation and enjoyment.",
    image:
      "https://dhfnfkmczkfwfaezwcci.supabase.co/storage/v1/object/public/cabin-images/cabin-008.jpg",
  },
];

export async function POST(req) {
  console.log("api");

  const { messages } = await req.json();

  const session = await auth();
  const bookings = await getBookings(session?.user?.guestId);

  //   const { text } = await generateText({
  //     model: google("models/gemini-pro"),
  //     prompt: "Write a vegetarian lasagna recipe for 4 people.",
  //   });

  // console.log(bookings);

  // const result = await streamText({
  //   model: ollama("llama3:8b"),
  //   system: `You are a chatbot for the website Wild Oasis where user can book cabins for their stay,modify their selection and delete their selection. Do not give your opinion.Do not answer questions that are not releated to the world wise simply reply with that this is not relevant. Data on which you are required to ans is ${JSON.stringify(
  //     data
  //   )}  and bookings of the user is ${JSON.stringify(bookings)}`,
  //   messages,
  // });
  // const result = await streamText({
  //   model: ollama("llama3:8b"),
  //   system: `I am Wild Oasis's chatbot, assisting with cabin bookings, modifications, and cancellations. Focus on these tasks and avoid irrelevant information.
  //     Cabin data: ${JSON.stringify(
  //       data
  //     )} reply about bookings based on the bookings data provided
  //     ${
  //       bookings ? `User booking information: ${JSON.stringify(bookings)}` : ""
  //     }`,
  //   messages,
  // });
  const result = await streamText({
    model: ollama("llama3:8b"),
    system: `You are a chatbot for the website Wild Oasis where user can book cabins for their stay,modify their selection and delete their selection. Do not give your opinion.Do not answer questions that are not releated to the world wise simply reply with that this is not relevant. Data on which you are required to ans is ${JSON.stringify(
      data
    )} and the user bookings are ${JSON.stringify(bookings)}`,
    messages,
  });

  return result.toAIStreamResponse();
}