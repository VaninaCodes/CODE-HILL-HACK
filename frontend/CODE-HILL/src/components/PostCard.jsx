function PostCard({ post, onViewMore }) {
  const imageUrl = post.image
    ? post.image.startsWith('http')
      ? post.image
      : `${(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '')}${post.image}`
    : null;

  return (
    <article className="post-card">
      {imageUrl && (
        <div className="post-card-image">
          <img src={imageUrl} alt={post.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
        </div>
      )}

      <div className="post-card-top">
        {post.author?.type && (
          <span className="post-type">
            {post.author.type}
          </span>
        )}
      </div>

      <div className="post-card-content">
        <h3>{post.title}</h3>

        <p className="post-description">{post.content}</p>

        <div className="post-tags">
          {post.tags?.map((tag) => (
            <span key={tag.id || tag}>{tag.name || tag}</span>
          ))}
        </div>

        <div className="post-card-bottom">
          <div className="post-info">
            {post.createdAt && (
              <span>{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
            )}
            {post.author?.username && <span>{post.author.username}</span>}
          </div>

          <button onClick={() => onViewMore?.(post)}>
            Ver más →
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;