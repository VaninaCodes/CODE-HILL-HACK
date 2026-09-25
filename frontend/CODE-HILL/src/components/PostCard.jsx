function PostCard({ post }) {

  return (
    <article className="post-card">

      <div className="post-card-top">

        <span className="post-type">
          {post.type}
        </span>

        {post.recommended && (
          <span className="recommended">
            ★ RECOMENDADO POR IA
          </span>
        )}

      </div>


      <div className="post-card-content">

        <h3>
          {post.title}
        </h3>

        <p className="post-description">
          {post.description}
        </p>


        <div className="post-tags">

          {post.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}

        </div>


        <div className="post-card-bottom">

          <div className="post-info">

            <span>
              {post.date}
            </span>

            <span>
              {post.location}
            </span>

          </div>

          <button>
            Ver más →
          </button>

        </div>

      </div>

    </article>
  );
}

export default PostCard;