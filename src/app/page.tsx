import Image from "next/image";
import Link from "next/link";
import { FormEvent } from 'react';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation';

export default function LoginPage() {

    redirect(`/setting`);

}
