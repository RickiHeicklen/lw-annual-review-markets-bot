import fetch from 'node-fetch';
import fs from 'fs';

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
  finalReviewVoteScoreHighKarma: number;
}

interface TagRel {
  _id: string;
  tagId: string;
  postId: string;
}

// @ts-ignore
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

// @ts-ignore
async function fetchPostsByYear(year : number): Promise<Post[] | undefined> {
  // note the async
  const response  = await fetch(graphQLendpoint, ({
    method: 'POST',
    headers: ({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(({ query: `
      {
        posts(input: {
          terms: {
            view: "new"
            limit: 10000
            meta: null  # this seems to get both meta and non-meta posts
          
            before: "${year}-12-31"
            after: "${year}-01-01"
          }
        }) {
          results {
            _id
            title
            slug
            pageUrl
            postedAt
            baseScore
            voteCount
            finalReviewVoteScoreHighKarma
            commentCount
            meta
            question
          }
        }
      }`
      })),
        }))

      const data: any = await response.json();
      return data.data.posts ? data.data.posts.results : undefined
}

// @ts-ignore
async function fetchTagRels(_id : string): Promise<TagRel[] | undefined> {
  // note the async
  const response  = await fetch(graphQLendpoint, ({
    method: 'POST',
    headers: ({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(({ query: `
    {
      tagRels(input: {
        terms: {
          limit: 10,
          view: "postsWithTag",
          tagId: "o9aQASibdsECTfYF6"
        } 
      }) {
        results {
          _id
          tagId
          postId
        }
      }
    }
  `
      })),
        }))

      const data: any = await response.json();
      console.log(data);
      return data.data.tagRels ? data.data.tagRels.results : undefined
}

// @ts-ignore
async function writePostsToCSV(posts: Post[], year: number) {
  const csvData = posts.map(post => ({
    postId: post._id,
    title: post.title,
    slug: post.slug,
    pageUrl: post.pageUrl,
    postedAt: post.postedAt,
    baseScore: post.baseScore,
    voteCount: post.voteCount,
    commentCount: post.commentCount,
    finalReviewVoteScoreHighKarma: post.finalReviewVoteScoreHighKarma,
    year: year
  }));

  const csv = 'postId,title,slug,pageUrl,postedAt,baseScore,voteCount,commentCount,finalReviewVoteScoreHighKarma,year\n' +
  csvData.map(row => Object.values(row).join(',')).join('\n');

  fs.writeFileSync(`lesswrong_posts_${year}.csv`, csv);
}

// Example usage
async function main() {

  // const postId = 'xhKr5KtvdJRssMeJ3';
  // const post = await fetchPost(postId);
  // console.log(post);

  const tagId = 'fkABsGCJZ6y9qConW';
  const tagRels = await fetchTagRels(tagId);
  console.log(tagRels?.length);

  // if (tagRels && tagRels.length > 0) {
  //   for (let i = 0; i < tagRels?.length; i++) {
  //     console.log(tagRels[i]?.postId);
  //   }
  // }

  for (let year = 2018; year < 2023; year++) {
    const posts = await fetchPostsByYear(year);
    console.log(`${posts?.length} in ${year}`);
    if (posts) {
      writePostsToCSV(posts, year);
    }
  }

  console.log("done!")
}

main();