import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head"
import { RichText } from "prismic-dom"
import { getPrismicClient } from "../../services/prismic"
import styles from './post.module.scss';

interface PostProps {
    posts: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ posts }: PostProps) {

    return (
        <>
            <Head>
                <title>{posts.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{posts.title}</h1>
                    <time>{posts.updatedAt}</time>
                    <div className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: posts.content }} />

                </article>
            </main>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req })
    const { slug }  = params;

    // if(!session?.activeSubscription){
    //     return {
    //         redirect: {
    //             destination: '/',
    //             pemanent: false,
    //         }
    //     }
    // }
    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID<any>('post', String(slug), {})

    const posts = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            posts,
        }
    }
}