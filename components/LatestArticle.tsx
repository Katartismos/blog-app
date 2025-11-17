import type { ArticleProps } from '@/lib/constants'

const LatestArticleCard: React.FC<ArticleProps> = ({ article }) => {
  const { id, title, excerpt, imageUrl, categoryColor, author, date, readTime } = article;
  const isSmallCard = id === 5 || id === 6 || id === 8 || id === 9; 

  if (isSmallCard) {
    return (
      <div className="latest-article-card flex bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer h-40">
        <div className="w-1/3 shrink-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col justify-center w-2/3">
          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded text-white ${categoryColor} mb-2 self-start`}>
            {article.category}
          </span>
          <h3 className="font-bold text-gray-900 line-clamp-2 text-md">{title}</h3>
          <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
            <span>{author}</span>
            <span>&bull;</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="latest-article-card bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-md text-white ${categoryColor} mb-3`}>
          {article.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{excerpt}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <span>{author}</span>
            <span className="mx-1">&bull;</span>
            <span>{date}</span>
          </div>
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
};

export default LatestArticleCard