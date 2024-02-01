import fetch from 'node-fetch';

console.log("hello world!");


const graphQLendpoint = 'https://www.lesswrong.com/graphql'

interface Post {
  _id: string;
  title: string;
  slug: string;
  pageUrl: string;
  postedAt: string;
  baseScore: number;
  voteCount: number;
  commentCount: number;
  meta: any;
  question: any;
  url: string;
  user: {
    username: string;
    slug: string;
    karma: number;
    maxPostCount: number;
    commentCount: number;
  };
}

async function fetchPost(id : string): Promise<Post | undefined> {
  // note the async
  const response  = await fetch(graphQLendpoint, ({
    method: 'POST',
    headers: ({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(({ query: `
       {
        post(
            input: {  
            selector: {
                _id: "${id}"
            }      
            }) 
        {
            result {
            _id
            title
            slug
            pageUrl
            postedAt
            baseScore
            voteCount
            commentCount
            meta
            question
            url
            user {
                username
                slug
                karma
                maxPostCount
                commentCount
            }
            }
        }
      }`
      })),
        }))

      const data: any = await response.json();
      return data.data.post ? data.data.post.result : undefined
}

// Example usage
async function main() {
  const postId = 'xhKr5KtvdJRssMeJ3';
  const post = await fetchPost(postId);
  console.log(post);
}

main();