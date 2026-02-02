import React, { useState, useEffect, useRef } from 'react';
import axios from '../../Utils/api';

const TutorDashboard = () => {
  const [tutorData, setTutorData] = useState({
    name: '',
    title: '',
    rating: null,
    students: 0,
    experience: '',
    avatar: '',
    profilePictureUpload: null,
    totalCoursesUploaded: 0,
  });
  const hasFetchedRef = useRef(false);

  const [metrics] = useState({
    weeklyEarnings: 1250,
    sessionCompletion: 98,
    studentRetention: 94,
    responseTime: "15 min"
  });

  const [upcomingSessions] = useState([
    {
      id: 1,
      studentName: "Michael Chen",
      subject: "Advanced Calculus",
      date: "Today",
      time: "14:00 - 15:00",
      status: "confirmed",
      avatar: "MC"
    },
    {
      id: 2,
      studentName: "Emily Rodriguez",
      subject: "Physics - Mechanics",
      date: "Today",
      time: "16:00 - 17:30",
      status: "confirmed",
      avatar: "ER"
    },
    {
      id: 3,
      studentName: "James Wilson",
      subject: "Linear Algebra",
      date: "Tomorrow",
      time: "10:00 - 11:00",
      status: "pending",
      avatar: "JW"
    }
  ]);

  const [performanceStats] = useState({
    weeklySessions: 18,
    studentProgress: 87,
    ratingTrend: "+2.3%",
    earningsTrend: "+12.5%"
  });

  const styles = {
    // Color Palette
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        900: '#0c4a6e'
      },
      gray: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      },
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a'
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706'
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626'
      }
    },

    // Typography Scale
    typography: {
      h1: {
        fontSize: '2.5rem',
        fontWeight: '700',
        lineHeight: '1.2',
        color: 'colors.gray.900'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: '600',
        lineHeight: '1.3',
        color: 'colors.gray.900'
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: '600',
        lineHeight: '1.4',
        color: 'colors.gray.900'
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: '600',
        lineHeight: '1.4',
        color: 'colors.gray.900'
      },
      body: {
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.5',
        color: 'colors.gray.600'
      },
      small: {
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.4',
        color: 'colors.gray.500'
      }
    },

    // Layout
    layout: {
      container: {
        minHeight: '100vh',
        backgroundColor: 'colors.gray.50',
        padding: '2rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '3rem'
      },
      grid: {
        display: 'grid',
        gap: '1.5rem'
      },
      card: {
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid colors.gray.200'
      }
    },

    // Components
    components: {
      avatar: {
        width: '3rem',
        height: '3rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        color: 'white',
        fontSize: '1rem'
      },
      badge: {
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        textTransform: 'capitalize'
      },
      button: {
        primary: {
          backgroundColor: 'colors.primary.500',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          border: 'none',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          ':hover': {
            backgroundColor: 'colors.primary.600'
          }
        },
        secondary: {
          backgroundColor: 'white',
          color: 'colors.primary.500',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid colors.primary.500',
          fontWeight: '600',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          ':hover': {
            backgroundColor: 'colors.primary.50'
          }
        }
      },
      progressBar: {
        container: {
          width: '100%',
          height: '0.5rem',
          backgroundColor: 'colors.gray.200',
          borderRadius: '9999px',
          overflow: 'hidden'
        },
        fill: {
          height: '100%',
          borderRadius: '9999px',
          transition: 'width 0.3s ease'
        }
      }
    }
  };

  // Helper function to resolve nested styles
  const resolveStyle = (stylePath) => {
    const path = stylePath.split('.');
    let value = styles;
    for (const key of path) {
      value = value[key];
    }
    return value;
  };

  // Add modal styles
  // modal moved to a dedicated page; keep styles local to page component

  // Avatar helpers: support data URI, remote URL, or raw base64
  const getInitials = (name) => {
    if (!name) return null;
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const resolveAvatarSrc = (img) => {
    if (!img) return null;
    const trimmed = String(img).trim();
    if (trimmed.startsWith('data:')) return trimmed; // full data URI
    if (/^https?:\/\//i.test(trimmed)) return trimmed; // URL
    if (trimmed.length < 50) return null; // likely not valid base64
    return `data:image/jpeg;base64,${trimmed}`; // assume raw base64
  };

  // Fetch profile for tutor and map fields
  useEffect(() => {
    // Get name from localStorage
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setTutorData((prev) => ({
        ...prev,
        name: storedName,
      }));
    }

    // fetchProfile accepts an options object. If { silent: true } it will not toggle loading state
    const fetchProfile = async (options = { silent: false }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return; // silently skip if not logged in
        }

        const res = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Support multiple possible response shapes
        // e.g. { success: true, profile: {...} } OR { data: {...} } OR { user: {...} }
        const payload = res && res.data ? res.data : {};
        const p = payload.profile ?? payload.data ?? payload.user ?? payload;

        if (p && (p.name || p.subject || p.qualification || p.profilePictureUpload || p.rating)) {
          setTutorData((prev) => ({
            ...prev,
            name: p.name ?? storedName ?? prev.name,
            title: p.subject ?? p.qualification ?? prev.title,
            experience: p.experience ?? prev.experience,
            // preserve existing rating/students if backend doesn't provide
            rating: p.rating ?? prev.rating,
            students: p.students ?? prev.students,
            profilePictureUpload: p.profilePictureUpload ?? prev.profilePictureUpload,
            totalCoursesUploaded: p.totalCoursesUploaded ?? prev.totalCoursesUploaded,
          }));
        }
        hasFetchedRef.current = true;
      } catch (err) {
        // keep defaults on error
        // console.error('Failed to fetch tutor profile', err);
      }
    };

    // initial fetch (show loading)
    fetchProfile({ silent: false });

    // re-fetch when page/tab becomes visible, but silently (no loading indicator)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchProfile({ silent: true });
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Greeting helpers: compute greeting based on local hour and update every minute
  const getGreetingText = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good morning';
    if (hr >= 12 && hr < 17) return 'Good afternoon';
    if (hr >= 17 && hr < 21) return 'Good evening';
    return 'Good night';
  };

  const [greeting, setGreeting] = useState(getGreetingText());

  useEffect(() => {
    const id = setInterval(() => {
      setGreeting(getGreetingText());
    }, 60 * 1000); // update every minute
    return () => clearInterval(id);
  }, []);

  // MetricCard Component
  const MetricCard = ({ title, value, trend, icon, color }) => (
    <div style={{
      ...resolveStyle('layout.card'),
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '-1rem',
        right: '-1rem',
        width: '6rem',
        height: '6rem',
        borderRadius: '50%',
        backgroundColor: `${resolveStyle(`colors.${color}.50`)}`,
        opacity: 0.5
      }}></div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <span style={{
            fontSize: '2rem'
          }}>{icon}</span>
          <span style={{
            ...resolveStyle('typography.small'),
            color: trend > 0 ? resolveStyle('colors.success.500') : resolveStyle('colors.error.500'),
            fontWeight: '600'
          }}>
            {trend}
          </span>
        </div>
        <h3 style={{
          ...resolveStyle('typography.h3'),
          marginBottom: '0.5rem'
        }}>{value}</h3>
        <p style={{
          ...resolveStyle('typography.small'),
          color: resolveStyle('colors.gray.500')
        }}>{title}</p>
      </div>
    </div>
  );

  // SessionCard Component
  const SessionCard = ({ session }) => (
    <div style={{
      ...resolveStyle('layout.card'),
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      transition: 'all 0.2s',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <div style={{
        ...resolveStyle('components.avatar'),
        backgroundColor: resolveStyle('colors.primary.500')
      }}>
        {session.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{
          ...resolveStyle('typography.h4'),
          marginBottom: '0.25rem'
        }}>{session.studentName}</h4>
        <p style={{
          ...resolveStyle('typography.small'),
          marginBottom: '0.5rem',
          color: resolveStyle('colors.gray.500')
        }}>{session.subject}</p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            ...resolveStyle('typography.small'),
            color: resolveStyle('colors.gray.400')
          }}>{session.date} • {session.time}</span>
        </div>
      </div>
      <div>
        <span style={{
          ...resolveStyle('components.badge'),
          backgroundColor: session.status === 'confirmed' ? resolveStyle('colors.success.50') : resolveStyle('colors.warning.50'),
          color: session.status === 'confirmed' ? resolveStyle('colors.success.600') : resolveStyle('colors.warning.600')
        }}>
          {session.status}
        </span>
      </div>
    </div>
  );

  // QuickAction Component
  const QuickAction = ({ icon, title, description, onClick }) => (
    <div style={{
      ...resolveStyle('layout.card'),
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        backgroundColor: resolveStyle('colors.primary.50'),
        borderColor: resolveStyle('colors.primary.500')
      }
    }} onClick={onClick}>
      <div style={{
        width: '3rem',
        height: '3rem',
        borderRadius: '0.75rem',
        backgroundColor: resolveStyle('colors.primary.500'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.25rem'
      }}>
        {icon}
      </div>
      <div>
        <h4 style={{
          ...resolveStyle('typography.h4'),
          marginBottom: '0.25rem'
        }}>{title}</h4>
        <p style={{
          ...resolveStyle('typography.small'),
          color: resolveStyle('colors.gray.500')
        }}>{description}</p>
      </div>
    </div>
  );

  return (
    <div style={resolveStyle('layout.container')}>
      {/* Terms moved to a dedicated page; acceptance handled at /terms */}
      {/* Header */}
      <div style={resolveStyle('layout.header')}>
        <div>
          <h1 style={resolveStyle('typography.h1')}>
            {greeting}{localStorage.getItem('name') ? `, ${localStorage.getItem('name')}` : ''} 👋
          </h1>
          <p style={{
            ...resolveStyle('typography.body'),
            color: resolveStyle('colors.gray.600'),
            marginTop: '0.5rem'
          }}>
            Here's your teaching overview for today
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button style={resolveStyle('components.button.secondary')}>
            View Calendar
          </button>
          <button style={resolveStyle('components.button.primary')}>
            New Session
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{
        ...resolveStyle('layout.grid'),
        gridTemplateColumns: '2fr 1fr'
      }}>
        
        {/* Left Column */}
        <div style={{
          ...resolveStyle('layout.grid'),
          gridTemplateRows: 'auto auto 1fr'
        }}>
          
          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            <MetricCard
              title="Weekly Earnings"
              value={`$${metrics.weeklyEarnings}`}
              trend="+12.5%"
              icon="💰"
              color="primary"
            />
            <MetricCard
              title="Session Completion"
              value={`${metrics.sessionCompletion}%`}
              trend="+2.3%"
              icon="✅"
              color="success"
            />
            <MetricCard
              title="Student Retention"
              value={`${metrics.studentRetention}%`}
              trend="+1.8%"
              icon="📈"
              color="warning"
            />
            <MetricCard
              title="Avg Response Time"
              value={metrics.responseTime}
              trend="-5min"
              icon="⚡"
              color="error"
            />
          </div>

          {/* Upcoming Sessions */}
          <div style={resolveStyle('layout.card')}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={resolveStyle('typography.h2')}>Upcoming Sessions</h2>
              <button style={{
                ...resolveStyle('typography.small'),
                color: resolveStyle('colors.primary.500'),
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}>
                View All
              </button>
            </div>
            <div>
              {upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div style={{
            ...resolveStyle('layout.card'),
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                ...resolveStyle('typography.h3'),
                marginBottom: '1rem'
              }}>Performance</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={resolveStyle('typography.small')}>Weekly Sessions</span>
                    <span style={{
                      ...resolveStyle('typography.small'),
                      fontWeight: '600'
                    }}>{performanceStats.weeklySessions}</span>
                  </div>
                  <div style={resolveStyle('components.progressBar.container')}>
                    <div style={{
                      ...resolveStyle('components.progressBar.fill'),
                      width: '90%',
                      backgroundColor: resolveStyle('colors.primary.500')
                    }}></div>
                  </div>
                </div>
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={resolveStyle('typography.small')}>Student Progress</span>
                    <span style={{
                      ...resolveStyle('typography.small'),
                      fontWeight: '600'
                    }}>{performanceStats.studentProgress}%</span>
                  </div>
                  <div style={resolveStyle('components.progressBar.container')}>
                    <div style={{
                      ...resolveStyle('components.progressBar.fill'),
                      width: `${performanceStats.studentProgress}%`,
                      backgroundColor: resolveStyle('colors.success.500')
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{
                ...resolveStyle('typography.h3'),
                marginBottom: '1rem'
              }}>Trends</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: resolveStyle('colors.success.50'),
                  borderRadius: '0.75rem'
                }}>
                  <span style={resolveStyle('typography.small')}>Rating Trend</span>
                  <span style={{
                    ...resolveStyle('typography.small'),
                    color: resolveStyle('colors.success.600'),
                    fontWeight: '600'
                  }}>{performanceStats.ratingTrend}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: resolveStyle('colors.primary.50'),
                  borderRadius: '0.75rem'
                }}>
                  <span style={resolveStyle('typography.small')}>Earnings Trend</span>
                  <span style={{
                    ...resolveStyle('typography.small'),
                    color: resolveStyle('colors.primary.600'),
                    fontWeight: '600'
                  }}>{performanceStats.earningsTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{
          ...resolveStyle('layout.grid'),
          gridTemplateRows: 'auto auto auto'
        }}>
          
          {/* Profile Card */}
          <div style={{
            ...resolveStyle('layout.card'),
            textAlign: 'center'
          }}>
            <div style={{
              ...resolveStyle('components.avatar'),
              backgroundColor: resolveStyle('colors.primary.500'),
              margin: '0 auto 1rem auto',
              width: '4rem',
              height: '4rem',
              fontSize: '1.25rem',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(() => {
                const src = resolveAvatarSrc(tutorData.profilePictureUpload || tutorData.avatar);
                if (src) {
                  return (
                    <img
                      src={src}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  );
                }
                return getInitials(tutorData.name) || tutorData.avatar;
              })()}
            </div>
            <h2 style={resolveStyle('typography.h2')}>{tutorData.name}</h2>
            <p style={{
              ...resolveStyle('typography.body'),
              color: resolveStyle('colors.gray.500'),
              marginBottom: '1rem'
            }}>{tutorData.title}</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{
                  ...resolveStyle('typography.h3'),
                  color: resolveStyle('colors.primary.500')
                }}>{tutorData.rating}</div>
                <div style={resolveStyle('typography.small')}>Rating</div>
              </div>
              <div>
                <div style={{
                  ...resolveStyle('typography.h3'),
                  color: resolveStyle('colors.primary.500')
                }}>{tutorData.students}</div>
                <div style={resolveStyle('typography.small')}>Students</div>
              </div>
              <div>
                <div style={{
                  ...resolveStyle('typography.h3'),
                  color: resolveStyle('colors.primary.500')
                }}>{tutorData.totalCoursesUploaded}</div>
                <div style={resolveStyle('typography.small')}>Courses</div>
              </div>
              <div>
                <div style={{
                  ...resolveStyle('typography.h3'),
                  color: resolveStyle('colors.primary.500')
                }}>{tutorData.experience}</div>
                <div style={resolveStyle('typography.small')}>Experience</div>
              </div>
            </div>
            <button style={{
              ...resolveStyle('components.button.secondary'),
              width: '100%'
            }}>
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div style={resolveStyle('layout.card')}>
            <h3 style={{
              ...resolveStyle('typography.h3'),
              marginBottom: '1.5rem'
            }}>Quick Actions</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <QuickAction
                icon="📝"
                title="Create Lesson"
                description="Design new teaching materials"
              />
              <QuickAction
                icon="📊"
                title="View Analytics"
                description="Student performance reports"
              />
              <QuickAction
                icon="💬"
                title="Messages"
                description="12 unread messages"
              />
              <QuickAction
                icon="🎯"
                title="Set Goals"
                description="Weekly teaching targets"
              />
            </div>
          </div>

          {/* Availability */}
          <div style={resolveStyle('layout.card')}>
            <h3 style={{
              ...resolveStyle('typography.h3'),
              marginBottom: '1rem'
            }}>Availability</h3>
            <p style={{
              ...resolveStyle('typography.body'),
              color: resolveStyle('colors.gray.600'),
              marginBottom: '1.5rem'
            }}>
              You're available for <strong>8 sessions</strong> this week
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button style={resolveStyle('components.button.primary')}>
                Update Schedule
              </button>
              <button style={resolveStyle('components.button.secondary')}>
                Set Break
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;