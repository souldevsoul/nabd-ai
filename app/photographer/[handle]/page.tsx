import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { VerifiedBadge } from "@/components/brand";
import { Button } from "@/components/ui/button";
import {
  SlLocationPin,
  SlGlobe,
  SlSocialInstagram,
  SlSocialTwitter,
  SlCalender,
  SlPicture,
  SlEye,
  SlArrowLeft,
} from "react-icons/sl";

interface Props {
  params: Promise<{ handle: string }>;
}

async function getPhotographer(handle: string) {
  // Try to find by handle first, then by ID
  const photographer = await db.user.findFirst({
    where: {
      OR: [
        { photographerProfile: { handle } },
        { id: handle },
      ],
      roles: { has: "PHOTOGRAPHER" },
    },
    include: {
      photographerProfile: true,
      photos: {
        where: { status: "VERIFIED" },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      _count: {
        select: {
          photos: {
            where: { status: "VERIFIED" },
          },
        },
      },
    },
  });

  return photographer;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const photographer = await getPhotographer(handle);

  if (!photographer) {
    return { title: "Photographer Not Found" };
  }

  const name = photographer.photographerProfile?.displayName || photographer.name || "Photographer";

  return {
    title: `${name} | Vertex`,
    description: photographer.photographerProfile?.bio || `View ${name}'s photography portfolio on Vertex.`,
  };
}

export default async function PhotographerProfilePage({ params }: Props) {
  const { handle } = await params;
  const photographer = await getPhotographer(handle);

  if (!photographer) {
    notFound();
  }

  const profile = photographer.photographerProfile;
  const displayName = profile?.displayName || photographer.name || "Photographer";
  const joinDate = photographer.createdAt;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Navigation */}
      <div className="pt-20 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/photographers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SlArrowLeft size={16} />
            Back to Photographers
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden bg-muted ring-4 ring-amber-500/20">
                {photographer.image || profile?.avatarUrl ? (
                  <Image
                    src={photographer.image || profile?.avatarUrl || ""}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-amber-500/20 text-amber-400 text-4xl font-bold">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
              {profile?.isVerified && (
                <div className="absolute -bottom-2 -right-2">
                  <VerifiedBadge size="lg" showLabel={false} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold uppercase">
                  {displayName}
                </h1>
              </div>

              <p className="text-muted-foreground mb-4">
                @{profile?.handle || "photographer"}
              </p>

              {profile?.bio && (
                <p className="text-lg text-muted-foreground max-w-2xl mb-6">
                  {profile.bio}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                {profile?.location && (
                  <span className="flex items-center gap-1.5">
                    <SlLocationPin size={14} className="text-amber-400" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <SlCalender size={14} className="text-amber-400" />
                  Joined {joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <SlPicture size={14} className="text-amber-400" />
                  {photographer._count.photos} photos
                </span>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {profile?.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                  >
                    <SlGlobe size={16} />
                    Website
                  </a>
                )}
                {profile?.socialInstagram && (
                  <a
                    href={`https://instagram.com/${profile.socialInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                  >
                    <SlSocialInstagram size={16} />
                    Instagram
                  </a>
                )}
                {profile?.socialX && (
                  <a
                    href={`https://x.com/${profile.socialX}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
                  >
                    <SlSocialTwitter size={16} />
                    X / Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-display font-bold uppercase mb-8">
            Portfolio
          </h2>

          {photographer.photos.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photographer.photos.map((photo) => (
                <Link
                  key={photo.id}
                  href={`/gallery/${photo.id}`}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-muted"
                >
                  <Image
                    src={photo.thumbnailUrl || photo.fileUrl}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-medium truncate">{photo.title}</p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs">
                      <SlEye size={12} />
                      View
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <SlPicture size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos yet</p>
            </div>
          )}

          {photographer.photos.length > 0 && (
            <div className="mt-12 text-center">
              <Link href={`/gallery?photographer=${profile?.handle || photographer.id}`}>
                <Button variant="outline" size="lg" className="border-white/20">
                  View All Photos in Gallery
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
