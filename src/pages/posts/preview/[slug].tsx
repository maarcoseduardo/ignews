import { GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss';

interface PostPreviewProps {
    posts: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ posts }: PostPreviewProps) {

    const {data: session} = useSession();
    const router = useRouter()

    useEffect(()=>{
        if(session?.activeSubscription){
            router.push(`/posts/${posts.slug}`)
        }
    }, [session])
    return (
        <>
            <Head>
                <title>{posts.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{posts.title}</h1>
                    <time>{posts.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewConent} `}
                        dangerouslySetInnerHTML={{ __html: posts.content }} />
                    <div className={styles.continueReading}>
                        Wabba Continue reading?
                        <Link href="/">
                        <a href="">Subscribe now 😁 </a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: {slug: 'saas-single-tenant-ou-multi-tenant-qual-escolher' } }
        ],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient()

    const response = await prismic.getByUID<any>('post', String(slug), {})

    const posts = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            posts,
        },
        redirect: 60 * 30, //30 minutes
    }
}