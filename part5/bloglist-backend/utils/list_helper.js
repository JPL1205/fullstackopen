const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, b) => acc + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  const maxLike = Math.max(...blogs.map((b) => b.likes))
  return blogs.find((b) => b.likes === maxLike)
}

const mostBlogs = (blogs) => {
  const authors = {}

  blogs.forEach((b) => {
    authors[b.author] = (authors[b.author] || 0) + 1
  })

  let top_author = null
  let blogs_cnt = 0

  for (author in authors) {
    // console.log(author)
    if (authors[author] > blogs_cnt) {
      top_author = author
      blogs_cnt = authors[author]
    }
  }

  const res = {
    author: top_author,
    blogs: blogs_cnt,
  }

  console.log(res)

  return res
}

const mostLikes = (blogs) => {
  const authors = {}

  blogs.forEach((b) => {
    authors[b.author] = (authors[b.author] || 0) + b.likes
  })

  let top_author = null
  let likes_cnt = 0

  for (author in authors) {
    // console.log(author)
    if (authors[author] > likes_cnt) {
      top_author = author
      likes_cnt = authors[author]
    }
  }

  const res = {
    author: top_author,
    likes: likes_cnt,
  }

  console.log(res)

  return res
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
