import React, { useState, useEffect } from "react";
import axios from "../../../../Utils/api";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Grid,
  IconButton,
  FormControlLabel, 
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Card,
  Divider,
  Avatar,
  Alert,
  Chip,
  CircularProgress
} from "@mui/material";
import { AddCircle, RemoveCircle, CloudUpload, VideoLibrary, Image, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CreateCourses = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Basic Information', 'Description', 'Instructor', 'Content', 'Review'];
  
  // Cache keys
  const FORM_CACHE_KEY = "courseUploadFormData";
  const CHAPTERS_CACHE_KEY = "courseUploadChapters";

  // Initial states
  const initialFormData = {
    CourseMotherId: "",
    useAutoCourseMotherId: true,
    coursename: "",
    category: "",
    courseduration: "6 months",
    contentduration: { hours: 0, minutes: 0 },
    price: {
      amount: 0,
      currency: "INR",
      discount: 0,
      finalPrice: 0,
    },
    level: "beginner",
    language: "english",
    certificates: "yes",
    description: "",
    whatYoullLearn: [],
    thumbnail: null,
    previewVideo: null,
    instructor: {
      name: "",
      role: "",
      socialmedia_id: "",
    },
  };
  const initialChapters = [
    {
      title: "",
      lessons: [
        {
          lessonname: "",
          audio: [],
          video: [],
          pdf: [],
        },
      ],
    },
  ];

  // Load cache on mount
  const [formData, setFormData] = useState(() => {
    const cached = localStorage.getItem(FORM_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // File objects can't be cached, so ignore thumbnail/previewVideo
        parsed.thumbnail = null;
        parsed.previewVideo = null;
        return parsed;
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  const [chapters, setChapters] = useState(() => {
    const cached = localStorage.getItem(CHAPTERS_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return initialChapters;
      }
    }
    return initialChapters;
  });

  const [whatYoullLearnInput, setWhatYoullLearnInput] = useState("");

  // Cache formData and chapters on change
  useEffect(() => {
    // Don't cache File objects
    const cacheForm = { ...formData, thumbnail: null, previewVideo: null };
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(cacheForm));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(CHAPTERS_CACHE_KEY, JSON.stringify(chapters));
  }, [chapters]);

  // Clear cache and reset form handler
  const handleClear = () => {
    localStorage.removeItem(FORM_CACHE_KEY);
    localStorage.removeItem(CHAPTERS_CACHE_KEY);
    setFormData(initialFormData);
    setChapters(initialChapters);
    setWhatYoullLearnInput("");
    setActiveStep(0);
    // show brief confirmation then auto-clear
    setMessage({ type: "success", text: "Form and cache cleared." });
    setTimeout(() => setMessage({ type: "", text: "" }), 1000);
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Available categories from your backend model
  const categories = [
    "Yoga",
    "Siddha Medicine",
    "Astrology",
    "Varma Therapy",
    "Ayurveda",
    "Pain Management",
    "Technology",
    "Business",
    "Personal Development",
    "Creative Arts",
    "Health & Wellness",
    "Academic",
    "Language Learning",
    "Career Development"
  ];

  // Calculate final price whenever amount or discount changes
  useEffect(() => {
    const amount = parseFloat(formData.price.amount) || 0;
    const discount = parseFloat(formData.price.discount) || 0;
    const finalPrice = amount * (1 - discount / 100);

    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
      },
    }));
  }, [formData.price.amount, formData.price.discount]);

  const handleNext = () => {
    // Validate current step before proceeding
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        if (!formData.coursename || !formData.category) {
          showMessage("error", "Course name and category are required");
          return false;
        }
        return true;
      case 1:
        if (!formData.description) {
          showMessage("error", "Course description is required");
          return false;
        }
        return true;
      case 3:
        // Validate chapters and lessons
        for (let chapter of chapters) {
          if (!chapter.title.trim()) {
            showMessage("error", "All chapters must have a title");
            return false;
          }
          for (let lesson of chapter.lessons) {
            if (!lesson.lessonname.trim()) {
              showMessage("error", "All lessons must have a name");
              return false;
            }
          }
        }
        return true;
      default:
        return true;
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleChange = (e) => {
    const { name, value, files, checked } = e.target;

    if (name === "useAutoCourseMotherId") {
      setFormData((prev) => ({
        ...prev,
        useAutoCourseMotherId: checked,
        CourseMotherId: checked ? "" : prev.CourseMotherId,
      }));
    } else if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name.startsWith("instructor.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [key]: value,
        },
      }));
    } else if (name.startsWith("contentduration.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contentduration: {
          ...prev.contentduration,
          [key]: parseInt(value) || 0,
        },
      }));
    } else if (name.startsWith("price.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [key]: key === "amount" || key === "discount" ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWhatYoullLearn = () => {
    if (whatYoullLearnInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        whatYoullLearn: [...prev.whatYoullLearn, whatYoullLearnInput.trim()],
      }));
      setWhatYoullLearnInput("");
    }
  };

  const removeWhatYoullLearn = (index) => {
    setFormData((prev) => ({
      ...prev,
      whatYoullLearn: prev.whatYoullLearn.filter((_, i) => i !== index),
    }));
  };

  const handleChapterChange = (index, e) => {
    const newChapters = [...chapters];
    newChapters[index][e.target.name] = e.target.value;
    setChapters(newChapters);
  };

  const handleLessonChange = (chapterIndex, lessonIndex, e) => {
    const { name, value, files } = e.target;
    const newChapters = [...chapters];
    const lesson = newChapters[chapterIndex].lessons[lessonIndex];

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      lesson[name] = fileArray;
      // store the original file names so we can send them to the server
      // use a property like audioname/videoname/pdfname
      const nameKey = `${name}name`;
      lesson[nameKey] = fileArray.map((f) => f.name).join(",");
    } else {
      lesson[name] = value;
    }

    setChapters(newChapters);
  };

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        title: "",
        lessons: [
          {
            lessonname: "",
            audio: [],
            video: [],
            pdf: [],
          },
        ],
      },
    ]);
  };

  const removeChapter = (index) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((_, i) => i !== index));
    }
  };

  const addLesson = (chapterIndex) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].lessons.push({
      lessonname: "",
      audio: [],
      video: [],
      pdf: [],
    });
    setChapters(newChapters);
  };

  const removeLesson = (chapterIndex, lessonIndex) => {
    const newChapters = [...chapters];
    if (newChapters[chapterIndex].lessons.length > 1) {
      newChapters[chapterIndex].lessons = newChapters[
        chapterIndex
      ].lessons.filter((_, i) => i !== lessonIndex);
      setChapters(newChapters);
    }
  };

  // Remove a specific uploaded file from a lesson (audio/video/pdf)
  const removeUploadedFile = (chapterIndex, lessonIndex, fileType, fileIndex) => {
    const newChapters = [...chapters];
    const lesson = newChapters[chapterIndex].lessons[lessonIndex];
    if (!lesson || !lesson[fileType]) return;
    // remove file object
    lesson[fileType] = lesson[fileType].filter((_, i) => i !== fileIndex);
    // update filename list if present
    const nameKey = `${fileType}name`;
    if (lesson[nameKey]) {
      const names = lesson[nameKey].split(",").filter((_, i) => i !== fileIndex);
      lesson[nameKey] = names.join(",");
    }
    setChapters(newChapters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!validateStep(activeStep)) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const data = new FormData();

  try {
      // Get tutor's ObjectId from token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload.id) {
        throw new Error('Token does not contain tutor ID');
      }

      // Add tutorObjectId to form data
      data.append('tutorObjectId', payload.id);

      // Add top-level fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "useAutoCourseMotherId") {
          data.append(key, value.toString());
          return;
        }
        
        if (key === "CourseMotherId" && formData.useAutoCourseMotherId) {
          return;
        }

        if (key === "instructor") {
          Object.entries(value).forEach(([subkey, subvalue]) => {
            if (subvalue) data.append(`instructor.${subkey}`, subvalue);
          });
        } else if (key === "contentduration") {
          Object.entries(value).forEach(([subkey, subvalue]) => {
            data.append(`contentduration.${subkey}`, subvalue.toString());
          });
        } else if (key === "price") {
          Object.entries(value).forEach(([subkey, subvalue]) => {
            if (subkey !== "finalPrice") {
              data.append(`price.${subkey}`, subvalue.toString());
            }
          });
        } else if (key === "whatYoullLearn") {
          value.forEach((item, index) => {
            data.append(`whatYoullLearn[${index}]`, item);
          });
        } else if (key === "thumbnail" || key === "previewVideo") {
          if (value && value instanceof File) {
            data.append(key, value);
          }
        } else if (value !== null && value !== undefined && value !== "") {
          data.append(key, value);
        }
      });

      // Add chapters and lessons
      chapters.forEach((chapter, cIndex) => {
        if (chapter.title.trim()) {
          data.append(`chapters[${cIndex}].title`, chapter.title);

          chapter.lessons.forEach((lesson, lIndex) => {
            if (lesson.lessonname.trim()) {
              const base = `chapters[${cIndex}].lessons[${lIndex}]`;
              data.append(`${base}.lessonname`, lesson.lessonname);

              // Handle each file type
              ["audio", "video", "pdf"].forEach((fileType) => {
                const files = lesson[fileType];
                // append filename(s) if we captured them during selection
                const fileNameKey = `${fileType}name`;
                if (lesson[fileNameKey]) {
                  data.append(`${base}.${fileNameKey}`, lesson[fileNameKey]);
                }
                if (files && Array.isArray(files)) {
                  files.forEach((file) => {
                    if (file instanceof File) {
                      data.append(`${base}.${fileType}`, file);
                    }
                  });
                }
              });
            }
          });
        }
      });

      console.log("Submitting course data...");
      
      const response = await axios.post("/createcourses-tutors", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Course creation response:", response.data);
      
  showMessage("success", "Course created successfully!");
  // Clear cache after successful save
  localStorage.removeItem(FORM_CACHE_KEY);
  localStorage.removeItem(CHAPTERS_CACHE_KEY);
  resetForm();
      
    } catch (err) {
      console.error("❌ Error creating course:", err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to create course";
      showMessage("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setChapters(initialChapters);
    setWhatYoullLearnInput("");
    setActiveStep(0);
    // Also clear cache
    localStorage.removeItem(FORM_CACHE_KEY);
    localStorage.removeItem(CHAPTERS_CACHE_KEY);
  };

  // Custom styles
  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2.5rem',
      color: '#312e81',
      fontWeight: 700,
      fontSize: '2.5rem',
      background: 'linear-gradient(90deg, #6366f1, #a21caf 80%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    stepper: {
      marginBottom: '3rem',
      padding: '1.5rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(236, 233, 254, 0.9)',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08)'
    },
    section: {
      padding: '2.5rem',
      marginBottom: '2.5rem',
      borderRadius: '16px',
      backgroundColor: '#f3f4f6',
      boxShadow: '0 10px 30px rgba(99, 102, 241, 0.07)',
      border: '1px solid #c7d2fe'
    },
    sectionTitle: {
      marginBottom: '2rem',
      fontWeight: 600,
      color: '#3730a3',
      fontSize: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid #a5b4fc'
    },
    input: {
      borderRadius: '10px',
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        backgroundColor: '#f8fafc',
        '&:hover fieldset': {
          borderColor: '#818cf8',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#a21caf',
        },
      }
    },
    fileUpload: {
      border: '2px dashed #a5b4fc',
      borderRadius: '12px',
      padding: '1.5rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      '&:hover': {
        borderColor: '#a21caf',
        backgroundColor: '#ede9fe'
      }
    },
    chip: {
      borderRadius: '8px',
      backgroundColor: '#c7d2fe',
      color: '#312e81',
      fontWeight: 500,
      '& .MuiChip-deleteIcon': {
        color: '#818cf8',
        '&:hover': {
          color: '#a21caf'
        }
      }
    },
    chapterCard: {
      padding: '1.5rem',
      marginBottom: '1.5rem',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      border: '1px solid #a5b4fc'
    },
    lessonCard: {
      padding: '1.5rem',
      marginBottom: '1rem',
      borderRadius: '10px',
      backgroundColor: '#fff',
      border: '1px solid #c7d2fe',
      position: 'relative'
    },
    buttonPrimary: {
      borderRadius: '10px',
      padding: '0.75rem 2rem',
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
      background: 'linear-gradient(90deg, #6366f1, #a21caf 80%)',
      color: '#fff',
      boxShadow: '0 4px 6px rgba(99, 102, 241, 0.15)',
      '&:hover': {
        background: 'linear-gradient(90deg, #a21caf, #6366f1 80%)',
        boxShadow: '0 6px 8px rgba(99, 102, 241, 0.22)',
        transform: 'translateY(-2px)'
      },
      '&:disabled': {
        background: '#cbd5e0',
        transform: 'none',
        boxShadow: 'none'
      }
    },
    buttonSecondary: {
      borderRadius: '10px',
      padding: '0.75rem 2rem',
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
      color: '#a21caf',
      borderColor: '#a5b4fc',
      backgroundColor: '#f3e8ff',
      '&:hover': {
        borderColor: '#6366f1',
        backgroundColor: '#ede9fe'
      }
    },
    priceDisplay: {
      padding: '1rem',
      borderRadius: '10px',
      backgroundColor: '#f0f9ff',
      border: '1px solid #a5b4fc',
      textAlign: 'center',
      marginTop: '1rem'
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '2.5rem'
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={styles.section}>
            <Typography sx={styles.sectionTitle}>
              <Avatar sx={{ bgcolor: '#4f46e5', mr: 2 }}>1</Avatar>
              Basic Course Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Course Name *"
                  name="coursename"
                  value={formData.coursename}
                  onChange={handleChange}
                  required
                  sx={styles.input}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel id="category-label" shrink>
                    Category *
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category *"
                    required
                    displayEmpty
                    renderValue={(selected) =>
                      selected ? (
                        selected
                      ) : (
                        <span style={{ color: '#6b7280' }}>Select category</span>
                      )
                    }
                    sx={{
                      minHeight: '56px',
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'normal',
                        lineHeight: '1.2',
                        paddingTop: '8px',
                        paddingBottom: '8px'
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em style={{ color: '#6b7280' }}>Select category</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel>Course Duration *</InputLabel>
                  <Select
                    name="courseduration"
                    value={formData.courseduration}
                    onChange={handleChange}
                    label="Course Duration *"
                    required
                  >
                    <MenuItem value="6 months">6 months</MenuItem>
                    <MenuItem value="1 year">1 year</MenuItem>
                    <MenuItem value="2 years">2 years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="useAutoCourseMotherId"
                      checked={formData.useAutoCourseMotherId}
                      onChange={handleChange}
                      sx={{ color: '#4f46e5', '&.Mui-checked': { color: '#4f46e5' } }}
                    />
                  }
                  label="Auto-generate CourseMotherId"
                />
                {!formData.useAutoCourseMotherId && (
                  <TextField
                    fullWidth
                    label="Course Mother ID *"
                    name="CourseMotherId"
                    value={formData.CourseMotherId}
                    onChange={handleChange}
                    required
                    disabled={formData.useAutoCourseMotherId}
                    sx={styles.input}
                    helperText="Leave auto-generate checked for automatic ID generation"
                  />
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price Amount (INR) *"
                  name="price.amount"
                  type="number"
                  value={formData.price.amount}
                  onChange={handleChange}
                  required
                  sx={styles.input}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="price.discount"
                  type="number"
                  value={formData.price.discount}
                  onChange={handleChange}
                  sx={styles.input}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  helperText="Discount between 0-100%"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={styles.priceDisplay}>
                  <Typography variant="body2" color="text.secondary">
                    Final Price
                  </Typography>
                  <Typography variant="h6" color="#4f46e5" fontWeight="600">
                    {formData.price.currency} {formData.price.finalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel>Level *</InputLabel>
                  <Select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    label="Level *"
                    required
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel>Language *</InputLabel>
                  <Select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    label="Language *"
                    required
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="tamil">Tamil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel>Certificates *</InputLabel>
                  <Select
                    name="certificates"
                    value={formData.certificates}
                    onChange={handleChange}
                    label="Certificates *"
                    required
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Content Duration
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Hours"
                        name="contentduration.hours"
                        type="number"
                        value={formData.contentduration.hours}
                        onChange={handleChange}
                        sx={styles.input}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Minutes"
                        name="contentduration.minutes"
                        type="number"
                        value={formData.contentduration.minutes}
                        onChange={handleChange}
                        sx={styles.input}
                        InputProps={{ inputProps: { min: 0, max: 59 } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Media Files
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={styles.fileUpload}>
                        <Image color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Thumbnail
                        </Typography>
                        <input
                          type="file"
                          name="thumbnail"
                          onChange={handleChange}
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload">
                          <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                            Upload
                          </Button>
                        </label>
                        {formData.thumbnail && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                            Selected: {formData.thumbnail.name}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={styles.fileUpload}>
                        <VideoLibrary color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Preview Video
                        </Typography>
                        <input
                          type="file"
                          name="previewVideo"
                          onChange={handleChange}
                          accept="video/*"
                          style={{ display: 'none' }}
                          id="video-upload"
                        />
                        <label htmlFor="video-upload">
                          <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                            Upload
                          </Button>
                        </label>
                        {formData.previewVideo && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'success.main' }}>
                            Selected: {formData.previewVideo.name}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={styles.navigation}>
              <div></div>
              <Button onClick={handleNext} sx={styles.buttonPrimary}>
                Next: Description
              </Button>
            </Box>
          </Paper>
        );
      
      case 1:
        return (
          <Paper sx={styles.section}>
            <Typography sx={styles.sectionTitle}>
              <Avatar sx={{ bgcolor: '#4f46e5', mr: 2 }}>2</Avatar>
              Course Description
            </Typography>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Course Description *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                minRows={4}
                maxRows={20}
                sx={styles.input}
                required
                InputProps={{
                  style: { overflow: 'auto', resize: 'vertical' }
                }}
              />
            </Box>
            <Typography sx={{ ...styles.sectionTitle, mb: 2, mt: 2, fontSize: '1.2rem', borderBottom: 'none', display: 'block', color: '#1e3a8a' }}>
              What You'll Learn
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', maxWidth: 600 }}>
              <TextField
                fullWidth
                value={whatYoullLearnInput}
                onChange={(e) => setWhatYoullLearnInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleWhatYoullLearn();
                  }
                }}
                placeholder="Add learning point"
                sx={styles.input}
              />
              <Button
                variant="contained"
                onClick={handleWhatYoullLearn}
                disabled={!whatYoullLearnInput.trim()}
                sx={styles.buttonPrimary}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ minHeight: 52, p: 2, borderRadius: 2, backgroundColor: '#e3f0ff', maxWidth: 600 }}>
              {formData.whatYoullLearn.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.whatYoullLearn.map((item, index) => (
                    <Chip
                      key={index}
                      label={item}
                      onDelete={() => removeWhatYoullLearn(index)}
                      sx={styles.chip}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#94a3b8', alignSelf: 'center', ml: 1 }}>
                  No learning points added yet
                </Typography>
              )}
            </Box>
            <Box sx={styles.navigation}>
              <Button onClick={handleBack} sx={styles.buttonSecondary}>
                Back
              </Button>
              <Button onClick={handleNext} sx={styles.buttonPrimary}>
                Next: Instructor
              </Button>
            </Box>
          </Paper>
        );
      
      case 2:
        return (
          <Paper sx={styles.section}>
            <Typography sx={styles.sectionTitle}>
              <Avatar sx={{ bgcolor: '#4f46e5', mr: 2 }}>3</Avatar>
              Instructor Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Instructor Name"
                  name="instructor.name"
                  value={formData.instructor.name}
                  onChange={handleChange}
                  sx={styles.input}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Instructor Role"
                  name="instructor.role"
                  value={formData.instructor.role}
                  onChange={handleChange}
                  sx={styles.input}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Social Media ID"
                  name="instructor.socialmedia_id"
                  value={formData.instructor.socialmedia_id}
                  onChange={handleChange}
                  sx={styles.input}
                />
              </Grid>
            </Grid>
            
            <Box sx={styles.navigation}>
              <Button onClick={handleBack} sx={styles.buttonSecondary}>
                Back
              </Button>
              <Button onClick={handleNext} sx={styles.buttonPrimary}>
                Next: Course Content
              </Button>
            </Box>
          </Paper>
        );
      
      case 3:
        return (
          <Paper sx={styles.section}>
            <Typography sx={styles.sectionTitle}>
              <Avatar sx={{ bgcolor: '#4f46e5', mr: 2 }}>4</Avatar>
              Course Content
            </Typography>

            {chapters.map((chapter, cIndex) => (
              <Card key={cIndex} sx={styles.chapterCard}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Chapter {cIndex + 1}
                  </Typography>
                  <IconButton
                    onClick={() => removeChapter(cIndex)}
                    disabled={chapters.length <= 1}
                    sx={{ color: chapters.length > 1 ? '#ef4444' : '#cbd5e0' }}
                  >
                    <RemoveCircle />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  label="Chapter Title *"
                  name="title"
                  value={chapter.title}
                  onChange={(e) => handleChapterChange(cIndex, e)}
                  sx={{ ...styles.input, mb: 3 }}
                  required
                />

                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Lessons
                </Typography>

                {chapter.lessons.map((lesson, lIndex) => (
                  <Card key={lIndex} sx={styles.lessonCard}>
                    <IconButton
                      sx={{ position: 'absolute', top: 8, right: 8, color: chapter.lessons.length > 1 ? '#ef4444' : '#cbd5e0' }}
                      onClick={() => removeLesson(cIndex, lIndex)}
                      disabled={chapter.lessons.length <= 1}
                    >
                      <RemoveCircle />
                    </IconButton>

                    <TextField
                      fullWidth
                      label="Lesson Name *"
                      name="lessonname"
                      value={lesson.lessonname}
                      onChange={(e) => handleLessonChange(cIndex, lIndex, e)}
                      sx={{ ...styles.input, mb: 2 }}
                      required
                    />

                    <Grid container spacing={2}>
                      {['audio', 'video', 'pdf'].map((type) => (
                        <Grid item xs={12} md={4} key={type}>
                          <Box sx={styles.fileUpload}>
                            <Typography variant="body2" sx={{ mb: 1, textTransform: 'uppercase', fontWeight: 500 }}>
                              {type} Files
                            </Typography>
                            <input
                              type="file"
                              name={type}
                              multiple
                              onChange={(e) => handleLessonChange(cIndex, lIndex, e)}
                              accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                              style={{ display: 'none' }}
                              id={`${type}-${cIndex}-${lIndex}`}
                            />
                            <label htmlFor={`${type}-${cIndex}-${lIndex}`}>
                              <Button variant="outlined" component="span" startIcon={<CloudUpload />}>
                                Upload
                              </Button>
                            </label>
                            {/* Show uploaded filenames if available, otherwise show file count */}
                            {lesson[`${type}name`] ? (
                              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                {lesson[`${type}name`].split(',').map((fname, i) => (
                                  <Chip
                                    key={i}
                                    label={fname}
                                    size="small"
                                    onDelete={() => removeUploadedFile(cIndex, lIndex, type, i)}
                                    sx={{ backgroundColor: '#e6f4ea' }}
                                  />
                                ))}
                              </Box>
                            ) : lesson[type] && lesson[type].length > 0 ? (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" display="block" sx={{ color: 'success.main' }}>
                                  {lesson[type].length} file(s) selected
                                </Typography>
                                {/* show basic players/previews for audio/video and links for pdf */}
                                {type === 'audio' && lesson.audio && lesson.audio.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    {lesson.audio.map((f, idx) => (
                                      <audio key={idx} controls src={URL.createObjectURL(f)} style={{ display: 'block', marginTop: 8, width: '100%' }} />
                                    ))}
                                  </Box>
                                )}
                                {type === 'video' && lesson.video && lesson.video.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    {lesson.video.map((f, idx) => (
                                      <video key={idx} controls src={URL.createObjectURL(f)} style={{ display: 'block', marginTop: 8, maxWidth: '100%' }} />
                                    ))}
                                  </Box>
                                )}
                                {type === 'pdf' && lesson.pdf && lesson.pdf.length > 0 && (
                                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {lesson.pdf.map((f, idx) => (
                                      <a key={idx} href={URL.createObjectURL(f)} target="_blank" rel="noreferrer">{f.name}</a>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            ) : null}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddCircle />}
                  onClick={() => addLesson(cIndex)}
                  sx={styles.buttonSecondary}
                >
                  Add Lesson
                </Button>
              </Card>
            ))}

            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={addChapter}
              sx={{ ...styles.buttonPrimary, mt: 2 }}
            >
              Add Chapter
            </Button>
            
            <Box sx={styles.navigation}>
              <Button onClick={handleBack} sx={styles.buttonSecondary}>
                Back
              </Button>
              <Button onClick={handleNext} sx={styles.buttonPrimary}>
                Next: Review
              </Button>
            </Box>
          </Paper>
        );
      
      case 4:
        return (
          <Paper sx={styles.section}>
            <Typography sx={styles.sectionTitle}>
              <Avatar sx={{ bgcolor: '#4f46e5', mr: 2 }}>5</Avatar>
              Review Course Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><strong>Course Name:</strong> {formData.coursename}</Typography>
                  <Typography><strong>Category:</strong> {formData.category}</Typography>
                  <Typography><strong>Duration:</strong> {formData.courseduration}</Typography>
                  <Typography><strong>Level:</strong> {formData.level}</Typography>
                  <Typography><strong>Language:</strong> {formData.language}</Typography>
                  <Typography><strong>Certificates:</strong> {formData.certificates}</Typography>
                  <Typography><strong>Price:</strong> {formData.price.currency} {formData.price.finalPrice.toFixed(2)}</Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Instructor
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><strong>Name:</strong> {formData.instructor.name}</Typography>
                  <Typography><strong>Role:</strong> {formData.instructor.role}</Typography>
                  <Typography><strong>Social Media:</strong> {formData.instructor.socialmedia_id}</Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Content Structure
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography><strong>Chapters:</strong> {chapters.length}</Typography>
                  <Typography><strong>Total Lessons:</strong> {chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)}</Typography>
                  <Typography><strong>Learning Points:</strong> {formData.whatYoullLearn.length}</Typography>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={styles.navigation}>
              <Button onClick={handleBack} sx={styles.buttonSecondary}>
                Back
              </Button>
              <Button 
                type="submit" 
                sx={styles.buttonPrimary}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Creating Course..." : "Create Course"}
              </Button>
            </Box>
          </Paper>
        );
      
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.container}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3, width: '100%' }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          sx={{
            color: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              transform: 'translateX(-4px)'
            },
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            padding: '8px 16px',
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleClear}
          color="error"
          variant="outlined"
          aria-label="clear-course-form"
          data-testid="clear-course-form"
          sx={{
            borderRadius: '12px',
            padding: '8px 16px',
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: 'transparent',
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': {
              backgroundColor: '#ffe4e6',
              borderColor: '#dc2626'
            }
          }}
        >
          Clear Cache
        </Button>
      </Box>

      <Typography variant="h3" sx={styles.header}>
        Create New Course
      </Typography>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={styles.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent(activeStep)}
    </Box>
  );
};

export default CreateCourses;