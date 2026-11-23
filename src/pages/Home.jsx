{listings.map((item, index) => (
  <ListingCard
    key={item._id}
    id={item._id}
    title={item.title}
    condition={`${item.condition} · Trade only`}
    accent={index % 2 === 0 ? '#14b8a6' : '#f59e0b'}
    imageUrl={item.imageUrl}
    wants={item.wants}
    owner={item.owner}
    saved={savedIds.includes(String(item._id))}
    onToggleSave={() => toggleSave(item)}
    onChat={
      myId && item.owner?._id && item.owner._id !== myId
        ? () => handleChat(item)
        : undefined
    }
  />
))}