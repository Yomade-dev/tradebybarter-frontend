import React from 'react';

const thumb = (url) =>
  url ? url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/') : '';

const ListingCard = ({ title, condition, accent, imageUrl, wants, saved, onToggleSave, onChat, onDelete }) => {
  return (
    <div className={`listing-card ${onToggleSave || onChat ? 'has-save' : ''}`}>
      <div className="listing-accent" style={{ backgroundColor: accent }}></div>
      {imageUrl && <img className="listing-img" src={thumb(imageUrl)} alt={title} loading="lazy" />}

      <div className="listing-body">
        <h6>{title}</h6>
        <p>{condition}</p>
        {wants && <p className="listing-wants">Wants: {wants}</p>}
        {onDelete && (
          <button type="button" className="delete-btn" onClick={onDelete}>Delete</button>
        )}
      </div>

      {onChat && (
        <button
          type="button"
          className="card-btn chat-btn"
          onClick={onChat}
          aria-label={`Chat with the owner of ${title}`}
        >
          Chat
        </button>
      )}

      {onToggleSave && (
        <button
          type="button"
          className="card-btn"
          onClick={onToggleSave}
          aria-pressed={!!saved}
          aria-label={saved ? `Remove ${title} from saved items` : `Save ${title}`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      )}
    </div>
  );
};

export default ListingCard;