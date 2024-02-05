import fetch from 'node-fetch';
import fs from 'fs';
console.log("hello world!");
const graphQLendpoint = 'https://www.lesswrong.com/graphql';
async function fetchPost(id) {
    const response = await fetch(graphQLendpoint, ({
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
    }));
    const data = await response.json();
    return data.data.post ? data.data.post.result : undefined;
}
async function fetchPostsByYear(year) {
    const response = await fetch(graphQLendpoint, ({
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
    }));
    const data = await response.json();
    return data.data.posts ? data.data.posts.results : undefined;
}
async function fetchTagRels(_id) {
    const response = await fetch(graphQLendpoint, ({
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
    }));
    const data = await response.json();
    console.log(data);
    return data.data.tagRels ? data.data.tagRels.results : undefined;
}
async function writePostsToCSV(posts, year) {
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
async function main() {
    const tagId = 'fkABsGCJZ6y9qConW';
    const tagRels = await fetchTagRels(tagId);
    console.log(tagRels?.length);
    for (let year = 2018; year < 2023; year++) {
        const posts = await fetchPostsByYear(year);
        console.log(`${posts?.length} in ${year}`);
        if (posts) {
            writePostsToCSV(posts, year);
        }
    }
    console.log("done!");
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TGVzc1dyb25nUG9zdHMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JpY2tpaGVpY2tsZW4vRGV2ZWxvcG1lbnQvR2l0aHViL2x3LWFubnVhbC1yZXZpZXctbWFya2V0cy1ib3QvIiwic291cmNlcyI6WyJzcmMvZ2V0TGVzc1dyb25nUG9zdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRzVCLE1BQU0sZUFBZSxHQUFHLG1DQUFtQyxDQUFBO0FBK0IzRCxLQUFLLFVBQVUsU0FBUyxDQUFDLEVBQVc7SUFFbEMsTUFBTSxRQUFRLEdBQUksTUFBTSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUMsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxDQUFDO1FBQ2pELElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUU7Ozs7O3dCQUtYLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUF5QmxCO1NBQ0QsQ0FBQyxDQUFDO0tBQ0EsQ0FBQyxDQUFDLENBQUE7SUFFTCxNQUFNLElBQUksR0FBUSxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtBQUMvRCxDQUFDO0FBR0QsS0FBSyxVQUFVLGdCQUFnQixDQUFDLElBQWE7SUFFM0MsTUFBTSxRQUFRLEdBQUksTUFBTSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUMsTUFBTSxFQUFFLE1BQU07UUFDZCxP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