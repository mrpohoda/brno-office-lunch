export function ErrorCard({ name, message = 'Menu není dostupné', phone, url }) {
    return (
        <div className="col-md-6">
            <div className="border-start border-3 border-warning ps-3 mb-4 opacity-50">
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <strong>{name}</strong>
                    {phone && url && (
                        <span className="text-muted small">{phone} · <a href={url} target="_blank">web</a></span>
                    )}
                </div>
                <hr className="mt-0 mb-2" />
                <span className="text-muted small">{message}</span>
            </div>
        </div>
    )
}
