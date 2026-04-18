import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllMusics, getAllAlbums, getAlbumById, uploadMusic, createAlbum, logoutUser } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("music"); // music | albums | upload | create-album
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const audioRef = useRef(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({ title: "", file: null });
  const [albumForm, setAlbumForm] = useState({ title: "", musics: [] });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchMusics();
    fetchAlbums();
  }, []);

  const fetchMusics = async () => {
    try {
      const data = await getAllMusics();
      setMusics(data.musics || []);
    } catch (e) { showToast(e.message, "error"); }
  };

  const fetchAlbums = async () => {
    try {
      const data = await getAllAlbums();
      setAlbums(data.musics || []);
    } catch (e) {}
  };

  const handlePlay = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
      else { audioRef.current?.play(); setIsPlaying(true); }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.uri;
      audioRef.current.play();
    }
  }, [currentTrack]);

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.file) return showToast("Fill all fields", "error");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", uploadForm.title);
      fd.append("music", uploadForm.file);
      await uploadMusic(fd);
      showToast("Track uploaded successfully!");
      setUploadForm({ title: "", file: null });
      fetchMusics();
      setTab("music");
    } catch (e) { showToast(e.message, "error"); }
    setLoading(false);
  };

  const handleCreateAlbum = async () => {
    if (!albumForm.title) return showToast("Enter album title", "error");
    setLoading(true);
    try {
      await createAlbum({ title: albumForm.title, musics: albumForm.musics });
      showToast("Album created!");
      setAlbumForm({ title: "", musics: [] });
      fetchAlbums();
      setTab("albums");
    } catch (e) { showToast(e.message, "error"); }
    setLoading(false);
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch (e) {}
    logout();
  };

  const openAlbum = async (album) => {
    try {
      const data = await getAlbumById(album.id || album._id);
      setSelectedAlbum(data.album);
      setTab("album-detail");
    } catch (e) { showToast(e.message, "error"); }
  };

  const isArtist = user?.role === "artist";

  return (
    <div className="dash-root">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="s-icon">♬</span>
          <span className="s-text">muse</span>
        </div>

        <div className="user-pill">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${tab === "music" ? "active" : ""}`} onClick={() => setTab("music")}>
            <span className="nav-icon">◈</span> All Tracks
          </button>
          <button className={`nav-item ${tab === "albums" ? "active" : ""}`} onClick={() => setTab("albums")}>
            <span className="nav-icon">◉</span> Albums
          </button>
          {isArtist && (
            <>
              <div className="nav-divider">Artist Tools</div>
              <button className={`nav-item ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
                <span className="nav-icon">↑</span> Upload Track
              </button>
              <button className={`nav-item ${tab === "create-album" ? "active" : ""}`} onClick={() => setTab("create-album")}>
                <span className="nav-icon">+</span> New Album
              </button>
            </>
          )}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>⏏</span> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            {tab === "music" && "All Tracks"}
            {tab === "albums" && "Albums"}
            {tab === "upload" && "Upload a Track"}
            {tab === "create-album" && "Create Album"}
            {tab === "album-detail" && selectedAlbum?.title}
          </h1>
          {tab === "album-detail" && (
            <button className="back-btn" onClick={() => setTab("albums")}>← Back</button>
          )}
        </div>

        {/* Music List */}
        {tab === "music" && (
          <div className="track-list">
            {musics.length === 0 && <p className="empty-msg">No tracks yet.</p>}
            {musics.map((m, i) => (
              <TrackRow key={m._id} track={m} index={i + 1}
                isActive={currentTrack?.id === m._id || currentTrack?._id === m._id}
                isPlaying={isPlaying && (currentTrack?._id === m._id)}
                onPlay={() => handlePlay({ ...m, id: m._id })} />
            ))}
          </div>
        )}

        {/* Albums */}
        {tab === "albums" && (
          <div className="album-grid">
            {albums.length === 0 && <p className="empty-msg">No albums yet.</p>}
            {albums.map((a) => (
              <div key={a._id} className="album-card" onClick={() => openAlbum(a)}>
                <div className="album-art">
                  <span>◉</span>
                </div>
                <div className="album-info">
                  <div className="album-title">{a.title}</div>
                  <div className="album-artist">{a.artist?.username || "Unknown Artist"}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Album Detail */}
        {tab === "album-detail" && selectedAlbum && (
          <div className="album-detail">
            <div className="album-detail-hero">
              <div className="album-hero-art">◉</div>
              <div>
                <div className="album-hero-title">{selectedAlbum.title}</div>
                <div className="album-hero-artist">{selectedAlbum.artist?.username}</div>
                <div className="album-hero-count">{selectedAlbum.musics?.length || 0} tracks</div>
              </div>
            </div>
            <div className="track-list">
              {(selectedAlbum.musics || []).map((m, i) => (
                <TrackRow key={m._id} track={m} index={i + 1}
                  isActive={currentTrack?._id === m._id}
                  isPlaying={isPlaying && currentTrack?._id === m._id}
                  onPlay={() => handlePlay({ ...m, id: m._id })} />
              ))}
            </div>
          </div>
        )}

        {/* Upload */}
        {tab === "upload" && isArtist && (
          <div className="form-card">
            <div className="form-field">
              <label>Track Title</label>
              <input value={uploadForm.title}
                onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Name your track..." />
            </div>
            <div className="form-field">
              <label>Audio File</label>
              <div className="file-drop" onClick={() => document.getElementById('file-input').click()}>
                {uploadForm.file ? (
                  <span className="file-name">🎵 {uploadForm.file.name}</span>
                ) : (
                  <span className="file-placeholder">Click to select an audio file<br/><small>MP3, WAV, FLAC supported</small></span>
                )}
              </div>
              <input id="file-input" type="file" accept="audio/*"
                style={{ display: "none" }}
                onChange={e => setUploadForm({ ...uploadForm, file: e.target.files[0] })} />
            </div>
            <button className="primary-btn" onClick={handleUpload} disabled={loading}>
              {loading ? <span className="spinner-sm" /> : "↑ Upload Track"}
            </button>
          </div>
        )}

        {/* Create Album */}
        {tab === "create-album" && isArtist && (
          <div className="form-card">
            <div className="form-field">
              <label>Album Title</label>
              <input value={albumForm.title}
                onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                placeholder="Album name..." />
            </div>
            <div className="form-field">
              <label>Add Tracks <span className="label-hint">(select from your uploads)</span></label>
              <div className="track-selector">
                {musics.length === 0 && <p className="empty-msg-sm">Upload tracks first.</p>}
                {musics.map(m => {
                  const selected = albumForm.musics.includes(m._id);
                  return (
                    <div key={m._id}
                      className={`track-select-row ${selected ? "selected" : ""}`}
                      onClick={() => {
                        const next = selected
                          ? albumForm.musics.filter(id => id !== m._id)
                          : [...albumForm.musics, m._id];
                        setAlbumForm({ ...albumForm, musics: next });
                      }}>
                      <span className="check">{selected ? "✓" : "○"}</span>
                      <span>{m.title}</span>
                      <span className="track-artist-sm">{m.artist?.username || ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="primary-btn" onClick={handleCreateAlbum} disabled={loading}>
              {loading ? <span className="spinner-sm" /> : "+ Create Album"}
            </button>
          </div>
        )}
      </main>

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="now-playing">
          <div className="np-track">
            <div className={`np-disc ${isPlaying ? "spinning" : ""}`}>◉</div>
            <div className="np-info">
              <div className="np-title">{currentTrack.title}</div>
              <div className="np-artist">{currentTrack.artist?.username || "Unknown"}</div>
            </div>
          </div>
          <button className="np-play-btn" onClick={() => handlePlay(currentTrack)}>
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

function TrackRow({ track, index, isActive, isPlaying, onPlay }) {
  return (
    <div className={`track-row ${isActive ? "active" : ""}`} onClick={onPlay}>
      <div className="track-num">
        {isPlaying ? <span className="eq-icon">▶</span> : <span>{String(index).padStart(2, "0")}</span>}
      </div>
      <div className="track-main">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist?.username || "Unknown Artist"}</div>
      </div>
      <div className="track-play-hint">▶</div>
    </div>
  );
}
