import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./avatar";

interface UserAvatarProps {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
    className?: string;
}

const UserAvatar = async ({ id, name, email, imageUrl, className = 'h-9 w-9' } : UserAvatarProps) => {
    const initials = name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Link href={ROUTES.PROFILE(id)}>
            <Avatar className={className}>
                {
                    imageUrl ? (

                        <Image src={imageUrl} alt={name} width={36} height={36} className='object-cover rounded-full'
                            quality={100} />

                    ) : (
                        <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
                            {initials}
                        </AvatarFallback>
                    )
                }
            </Avatar>
        </Link>
    )
}

export default UserAvatar;