import React from 'react';
import { Link } from 'react-router-dom';

const thumb = (url) =>
  url ? url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/') : '';

function OwnerAvatar({ owner }) {
  if (owner.avatarUrl) return <img className="owner-avatar" src={owner.avatarUrl} alt="" />;
  return (
    <span className="owner-avatar" aria-hidden="true">
      {(owner.name || '?').charAt(0).toUpperCase()}
    </span>
  );
}

const ListingCard = ({
  id, title, condition, accent, imageUrl, wants, owner,
  saved, onToggleSave, onChat, onDelete,
}) => {
  const to = id ? `/item/${id}` : null;
  const photo = imageUrl && (
    <img className="listing-img" src={thumb(imageUrl)} alt={title} loading="lazy" />
  );

  return (
    <div className={`listing-card ${onToggleSave || onChat ? 'has-save' : ''}`}>
      <div className="listing-accent" style={{ backgroundColor: accent }}></div>

      {photo && (to ? (
        <Link to={to} className="listing-link" tabIndex={-1} aria-hidden="true">{photo}</Link>
      ) : photo)}

      <div className="listing-body">
        <h6>{to ? <Link to={to} className="listing-title-link">{title}</Link> : title}</h6>
        <p>{condition}</p>
        {wants && <p className="listing-wants">Wants: {wants}</p>}
        {owner && (
          <p className="listing-owner">
            <OwnerAvatar owner={owner} />
            <span>{owner.name}</span>
          </p>
        )}
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