import React, { useState, useEffect } from "react";
import { Sun, Moon, Edit3, Save, X, LogOut } from "lucide-react";
import Auth from "./Auth";
import "./App.css";
import "./Auth.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const API_BASE = "http://localhost:3001/api";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  // Default data structure
  const defaultData = {
    name: "Mubeen jawed",
    title: "physics & cs @ stanford",
    socialLinks: [
      { name: "github", url: "https://github.com/Mubeen-jawed" },
      { name: "x", url: "https://x.com/jawed_mubeen" },
      { name: "linkedin", url: "www.linkedin.com/in/mubeejaweddev" },
    ],
    experiences: [
      {
        role: "fullstack engineering intern",
        company: "context ai",
        companyUrl: "https://www.context.ai",
        description:
          "wired frontend components for launch + patched Vercel SDK for prompt caching",
      },
      {
        role: "fullstack engineering intern",
        company: "redwoodsmb",
        companyUrl: "#",
        description:
          "created Go backend and Typescript frontend for startup backed by GC, Lux, KXVC, AV1",
      },
      {
        role: "security software engineering intern",
        company: "tiktok",
        companyUrl: "https://www.tiktok.com/",
        description:
          "built a React site demoing TikTok passkey service to Mastercard, AMEX, Starbucks, etc.\nachieved 13x decrease in latency with new Go passkey SDK integration",
      },
      {
        role: "llm research intern",
        company: "mathos ai",
        companyUrl: "https://www.mathgptpro.com/",
        description:
          "explored agent-based framework for improving LLM accuracy on math problems\nbuilt RAG system achieving 90% peak accuracy for math questions",
      },
    ],
    projects: [
      {
        projectName: "fullstack engineering intern",
        projectUrl: "https://www.context.ai",
        description:
          "wired frontend components for launch + patched Vercel SDK for prompt caching",
      },
      {
        projectName: "fullstack engineering intern",
        projectUrl: "https://www.redwoodsmb.com",
        description:
          "created Go backend and Typescript frontend for startup backed by GC, Lux, KXVC, AV1",
      },
      {
        projectName: "security software engineering intern",
        projectUrl: "https://www.tiktok.com/",
        description:
          "built a React site demoing TikTok passkey service to Mastercard, AMEX, Starbucks, etc.\nachieved 13x decrease in latency with new Go passkey SDK integration",
      },
      {
        projectName: "llm research intern",
        projectUrl: "https://www.mathgptpro.com/",
        description:
          "explored agent-based framework for improving LLM accuracy on math problems\nbuilt RAG system achieving 90% peak accuracy for math questions",
      },
    ],
  };

  // Load data from API
  useEffect(() => {
    checkExistingAuth();
    fetchData();
  }, []);

  const checkExistingAuth = async () => {
    const savedToken = localStorage.getItem("portfolio_token");
    const savedUser = localStorage.getItem("portfolio_user");

    if (savedToken && savedUser) {
      try {
        // Verify token with backend
        const response = await fetch(`${API_BASE}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setToken(savedToken);
          setUser(userData.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem("portfolio_token");
          localStorage.removeItem("portfolio_user");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("portfolio_token");
        localStorage.removeItem("portfolio_user");
      }
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and storage
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setEditMode(false);
      localStorage.removeItem("portfolio_token");
      localStorage.removeItem("portfolio_user");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE}/portfolio`);
      if (response.ok) {
        const portfolioData = await response.json();
        setData(portfolioData);
      } else {
        setData(defaultData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData(defaultData);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditMode(false);
        alert("Changes saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save changes: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to save data:", error);
      alert("Failed to save changes");
    }
  };

  const updateField = (path, value) => {
    const newData = { ...data };
    const keys = path.split(".");
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setData(newData);
  };

  const updateExperience = (index, field, value) => {
    const newData = { ...data };
    newData.experiences[index][field] = value;
    setData(newData);
  };

  const updateProjects = (index, field, value) => {
    const newData = { ...data };
    newData.projects[index][field] = value;
    setData(newData);
  };

  const updateSocialLink = (index, field, value) => {
    const newData = { ...data };
    newData.socialLinks[index][field] = value;
    setData(newData);
  };

  const addExperience = () => {
    const newData = { ...data };
    newData.experiences.push({
      role: "new role",
      company: "company name",
      companyUrl: "#",
      description: "description of your work",
    });
    setData(newData);
  };

  const removeExperience = (index) => {
    const newData = { ...data };
    newData.experiences.splice(index, 1);
    setData(newData);
  };

  const addProjects = () => {
    const newData = { ...data };
    newData.projects.push({
      projectName: "new project",
      projectUrl: "#",
      description: "description of your project",
    });
    setData(newData);
  };

  const removeProjects = (index) => {
    const newData = { ...data };
    newData.projects.splice(index, 1);
    setData(newData);
  };

  const year = new Date(Date.now()).getFullYear();

  if (loading) {
    return (
      <div className={`spinner-wrapper dark ${darkMode ? "dark" : ""}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="container">
        {/* Header with theme toggle and auth controls */}
        <header className="header">
          <div className="header-controls">
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            {isAuthenticated && (
              <>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="edit-button"
                    aria-label="Edit content"
                  >
                    <Edit3 size={20} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="edit-controls">
                    <button
                      onClick={saveData}
                      className="save-button"
                      aria-label="Save changes"
                    >
                      <Save size={20} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        fetchData(); // Revert changes
                      }}
                      className="cancel-button"
                      aria-label="Cancel editing"
                    >
                      <X size={20} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="logout-button"
                  aria-label="Logout"
                  title={`Logged in as ${user?.username}`}
                >
                  <LogOut size={20} />
                  <span className="logout-username">{user?.username}</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="main-content">
          {/* Name and title */}
          <div className="intro-section">
            <div className="name-social">
              {editMode ? (
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="name-input edit-input"
                  placeholder="Your name"
                />
              ) : (
                <h1 className="name">{data.name}</h1>
              )}

              <div className="social-links">
                {data.socialLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    {editMode ? (
                      <div className="social-link-edit">
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) =>
                            updateSocialLink(index, "name", e.target.value)
                          }
                          className="edit-input small"
                          placeholder="Link name"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            updateSocialLink(index, "url", e.target.value)
                          }
                          className="edit-input small"
                          placeholder="URL"
                        />
                      </div>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        {link.name}
                      </a>
                    )}
                    {index < data.socialLinks.length - 1 && (
                      <span className="separator">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {editMode ? (
              <input
                type="text"
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="title-input edit-input"
                placeholder="Your title/description"
              />
            ) : (
              <p className="title">{data.title}</p>
            )}

            <div className="previously-label">previously:</div>
          </div>

          {/* Experience list */}
          <div className="experiences">
            {data.experiences.map((exp, index) => (
              <div key={index} className="experience">
                {editMode && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="remove-button"
                    aria-label="Remove experience"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="experience-header">
                  {editMode ? (
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(index, "role", e.target.value)
                      }
                      className="edit-input"
                      placeholder="Job role"
                    />
                  ) : (
                    <span className="role">{exp.role}</span>
                  )}

                  <span className="at-symbol">@</span>

                  {editMode ? (
                    <div className="company-edit">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        className="edit-input"
                        placeholder="Company name"
                      />
                      <input
                        type="url"
                        value={exp.companyUrl}
                        onChange={(e) =>
                          updateExperience(index, "companyUrl", e.target.value)
                        }
                        className="edit-input"
                        placeholder="Company URL"
                      />
                    </div>
                  ) : (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link"
                    >
                      {exp.company}
                    </a>
                  )}
                </div>

                {editMode ? (
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    className="description-input edit-input"
                    placeholder="Describe your work and achievements"
                    rows="3"
                  />
                ) : (
                  <div className="description">
                    {exp.description.split("\n").map((line, lineIndex) => (
                      <div key={lineIndex}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {editMode && (
              <button onClick={addExperience} className="add-experience-button">
                + Add Experience
              </button>
            )}
          </div>

          <div className="previously-label">projects:</div>

          <div className="experiences">
            {data.projects.map((exp, index) => (
              <div key={index} className="experience">
                {editMode && (
                  <button
                    onClick={() => removeProjects(index)}
                    className="remove-button"
                    aria-label="Remove experience"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="experience-header">
                  <span className="role">built </span>

                  {editMode ? (
                    <div className="company-edit">
                      <input
                        type="text"
                        value={exp.projectName}
                        onChange={(e) =>
                          updateProjects(index, "projectName", e.target.value)
                        }
                        className="edit-input"
                        placeholder="Project Name"
                      />
                      <input
                        type="url"
                        value={exp.projectUrl}
                        onChange={(e) =>
                          updateProjects(index, "projectUrl", e.target.value)
                        }
                        className="edit-input"
                        placeholder="Project URL"
                      />
                    </div>
                  ) : (
                    <a
                      href={exp.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link"
                    >
                      {exp.projectName}
                    </a>
                  )}
                </div>

                {editMode ? (
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateProjects(index, "description", e.target.value)
                    }
                    className="description-input edit-input"
                    placeholder="Describe your work and achievements"
                    rows="3"
                  />
                ) : (
                  <div className="description">
                    {exp.description.split("\n").map((line, lineIndex) => (
                      <div key={lineIndex}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {editMode && (
              <button onClick={addProjects} className="add-experience-button">
                + Add Project
              </button>
            )}
          </div>

          <div className="previously-label">contact:</div>
          <div className="experience-header">
            <span className="email">jawedmubeen905 [at] gmail [dot] com</span>
          </div>

          <div className="footer">© Mubeen Jawed {year}</div>
        </main>
      </div>

      {/* Auth Modal */}
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={<Auth onLogin={handleLogin} darkMode={darkMode} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
