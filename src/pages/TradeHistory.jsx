import PageShell from '../components/PageShell';

export default function TradeHistory() {
  return (
    <PageShell title="Trade history">
      <div className="glass-card">
        <p className="page-note">No trades yet.</p>
        <p className="page-note-sub">
          Completed trades will show up here once offers and chat are live.
        </p>
      </div>
    </PageShell>
  );
}