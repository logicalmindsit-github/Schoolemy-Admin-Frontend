import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../Utils/api";

const EditCourse = () => {
  const { coursename } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    coursename: "",
    category: "",
    courseduration: "",
    level: "",
    language: "",
    certificates: "",
    description: "",
    "price.amount": "",
    "price.discount": "",
    "price.currency": "INR",
    contentduration: { hours: 0, minutes: 0 },
    whatYoullLearn: "",
    chapters: [],
    emi: {
      isAvailable: false,
      emiDurationMonths: "",
      monthlyAmount: "",
      totalAmount: "",
      notes: "",
    },
  });
  const [filesToUpload, setFilesToUpload] = useState({});
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `/courses-tutors/${encodeURIComponent(coursename)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const course = res.data;

        setFormData({
          coursename: course.coursename,
          category: course.category,
          courseduration: course.courseduration,
          level: course.level,
          language: course.language,
          certificates: course.certificates,
          description: course.description,
          "price.amount": course.price?.amount || "",
          "price.discount": course.price?.discount || "",
          "price.currency": course.price?.currency || "INR",
          "price.finalPrice":
            course.price?.finalPrice ||
            (course.price?.amount
              ? course.price.amount * (1 - (course.price.discount || 0) / 100)
              : 0),
          contentduration: course.contentduration || { hours: 0, minutes: 0 },
          whatYoullLearn: course.whatYoullLearn?.join(", ") || "",
          chapters: (course.chapters || []).map((chapter) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson) => ({
              ...lesson,
              audioname: "",
              videoname: "",
              pdfname: "",
            })),
          })),
          emi: course.emi || {
            isAvailable: false,
            emiDurationMonths: "",
            monthlyAmount: "",
            totalAmount: "",
            notes: "",
          },
        });
      } catch (err) {
        console.error("❌ Fetch course error:", err);
        setError("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [coursename]);

  // Calculate final price whenever amount or discount changes
  useEffect(() => {
    const amount = parseFloat(formData["price.amount"]) || 0;
    const discount = parseFloat(formData["price.discount"]) || 0;
    const finalPrice = amount * (1 - discount / 100);

    setFormData((prev) => ({
      ...prev,
      "price.finalPrice": parseFloat(finalPrice.toFixed(2)),
    }));
  }, [formData]);

  // Function to parse course duration to months
  const parseDurationToMonths = (duration) => {
    if (duration === "6 months") return 6;
    if (duration === "1 year") return 12;
    if (duration === "2 years") return 24;
    return 0;
  };

  // Auto-calculate EMI details based on final price and course duration
  useEffect(() => {
    if (formData.emi.isAvailable) {
      const months = parseDurationToMonths(formData.courseduration);
      const finalPrice = formData["price.finalPrice"];

      setFormData((prev) => ({
        ...prev,
        emi: {
          ...prev.emi,
          emiDurationMonths: months,
          totalAmount: finalPrice,
          monthlyAmount: months > 0 ? Math.round(finalPrice / months) : 0,
        },
      }));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [main, sub] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [main]: {
          ...prev[main],
          [sub]: finalValue,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleChapterChange = (index, field, value) => {
    const newChapters = [...formData.chapters];
    newChapters[index][field] = value;
    setFormData((prev) => ({ ...prev, chapters: newChapters }));
  };

  const handleLessonChange = (chapterIdx, lessonIdx, field, value) => {
    const updatedChapters = [...formData.chapters];
    updatedChapters[chapterIdx].lessons[lessonIdx][field] = value;
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleFileChange = (e, chapterIdx, lessonIdx, fileType) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = { ...filesToUpload };
    const fieldName = `chapters[${chapterIdx}].lessons[${lessonIdx}].${fileType}File`;

    if (!newFiles[fieldName]) {
      newFiles[fieldName] = [];
    }

    newFiles[fieldName] = [...newFiles[fieldName], ...Array.from(files)];
    setFilesToUpload(newFiles);
    e.target.value = ""; // Reset file input
  };

  const addNewChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: "",
          lessons: [
            {
              lessonname: "",
              audioFile: [],
              videoFile: [],
              pdfFile: [],
            },
          ],
        },
      ],
    }));
  };

  const removeChapter = (chapterIdx) => {
    const chapter = formData.chapters[chapterIdx];
    const filesToRemove = [];

    chapter.lessons.forEach((lesson) => {
      filesToRemove.push(...(lesson.audioFile || []));
      filesToRemove.push(...(lesson.videoFile || []));
      filesToRemove.push(...(lesson.pdfFile || []));
    });

    setFilesToDelete((prev) => [...prev, ...filesToRemove]);
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, idx) => idx !== chapterIdx),
    }));
  };

  const addNewLesson = (chapterIdx) => {
    const updatedChapters = [...formData.chapters];
    updatedChapters[chapterIdx].lessons.push({
      lessonname: "",
      audioFile: [],
      videoFile: [],
      pdfFile: [],
    });
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const removeLesson = (chapterIdx, lessonIdx) => {
    const lesson = formData.chapters[chapterIdx].lessons[lessonIdx];
    const filesToRemove = [
      ...(lesson.audioFile || []),
      ...(lesson.videoFile || []),
      ...(lesson.pdfFile || []),
    ];

    setFilesToDelete((prev) => [...prev, ...filesToRemove]);

    const updatedChapters = [...formData.chapters];
    updatedChapters[chapterIdx].lessons = updatedChapters[
      chapterIdx
    ].lessons.filter((_, idx) => idx !== lessonIdx);
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const removeMediaFile = (chapterIdx, lessonIdx, fileType, fileIndex) => {
    const updatedChapters = [...formData.chapters];
    const fileToRemove =
      updatedChapters[chapterIdx].lessons[lessonIdx][fileType][fileIndex];

    setFilesToDelete((prev) => [...prev, fileToRemove]);

    updatedChapters[chapterIdx].lessons[lessonIdx][fileType] = updatedChapters[
      chapterIdx
    ].lessons[lessonIdx][fileType].filter((_, idx) => idx !== fileIndex);
    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      // Append main fields
      for (const key in formData) {
        if (key === "chapters") continue;
        if (key === "emi") {
          // Handle EMI separately to ensure proper formatting
          form.append("emi.isAvailable", formData.emi.isAvailable.toString());
          
          if (formData.emi.isAvailable) {
            if (formData.emi.emiDurationMonths)
              form.append("emi.emiDurationMonths", formData.emi.emiDurationMonths.toString());
            if (formData.emi.totalAmount)
              form.append("emi.totalAmount", formData.emi.totalAmount.toString());
            if (formData.emi.monthlyAmount)
              form.append("emi.monthlyAmount", formData.emi.monthlyAmount.toString());
          } else {
            // Reset EMI values when disabled
            form.append("emi.emiDurationMonths", "");
            form.append("emi.totalAmount", "");
            form.append("emi.monthlyAmount", "");
          }
          
          if (formData.emi.notes)
            form.append("emi.notes", formData.emi.notes);
        } else if (key === "whatYoullLearn") {
          const items = formData[key]
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
          items.forEach((item) => form.append("whatYoullLearn", item));
        } else if (typeof formData[key] === "object") {
          for (const subKey in formData[key]) {
            form.append(`${key}.${subKey}`, formData[key][subKey]);
          }
        } else {
          form.append(key, formData[key]);
        }
      }

      // Append files to delete
      filesToDelete.forEach((file) => {
        if (file && file.url) {
          form.append("filesToDelete", JSON.stringify(file));
        }
      });

      // Append chapters and lessons with proper UTF-8 encoding for Tamil characters
      formData.chapters.forEach((chapter, chIdx) => {
        // Ensure string encoding for international characters
        form.append(`chapters[${chIdx}].title`, String(chapter.title || ""));
        chapter.lessons.forEach((lesson, lsIdx) => {
          // Properly encode Tamil and other Unicode characters
          form.append(
            `chapters[${chIdx}].lessons[${lsIdx}].lessonname`,
            String(lesson.lessonname || "")
          );

          // Add custom file names
          if (lesson.audioname)
            form.append(
              `chapters[${chIdx}].lessons[${lsIdx}].audioname`,
              lesson.audioname
            );
          if (lesson.videoname)
            form.append(
              `chapters[${chIdx}].lessons[${lsIdx}].videoname`,
              lesson.videoname
            );
          if (lesson.pdfname)
            form.append(
              `chapters[${chIdx}].lessons[${lsIdx}].pdfname`,
              lesson.pdfname
            );
        });
      });

      // Append files to upload
      for (const fieldName in filesToUpload) {
        filesToUpload[fieldName].forEach((file) => {
          form.append(fieldName, file);
        });
      }

      const response = await axios.put(
        `/course-tutors/update/${encodeURIComponent(coursename)}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("✅ Course updated successfully!");
        navigate(-1);
      } else {
        throw new Error(response.data.error || "Failed to update course");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      setError(err.response?.data?.error || err.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.coursename) {
    return <div className="loading">Loading course data...</div>;
  }

  return (
    <div className="edit-course-container">
      <h2>Edit Course: {coursename}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Course Info Section */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Course Name:</label>
            <input
              name="coursename"
              value={formData.coursename}
              onChange={handleChange}
              disabled
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category:</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Duration:</label>
              <select
                name="courseduration"
                value={formData.courseduration}
                onChange={handleChange}
                required
              >
                <option value="">Select duration</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="form-section">
          <h3>Course Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Level:</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language:</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
              >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
              </select>
            </div>

            <div className="form-group">
              <label>Certificate:</label>
              <select
                name="certificates"
                value={formData.certificates}
                onChange={handleChange}
                required
              >
                <option value="">Select option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>What You'll Learn (comma separated):</label>
            <textarea
              name="whatYoullLearn"
              value={formData.whatYoullLearn}
              onChange={handleChange}
              placeholder="Enter comma separated learning objectives"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="form-section">
          <h3>Pricing</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Amount:</label>
              <input
                name="price.amount"
                type="number"
                min="0"
                step="0.01"
                value={formData["price.amount"]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Discount (%):</label>
              <input
                name="price.discount"
                type="number"
                min="0"
                max="100"
                value={formData["price.discount"]}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Currency:</label>
              <input
                name="price.currency"
                value={formData["price.currency"]}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label>Final Price:</label>
              <input
                type="number"
                value={formData["price.finalPrice"]}
                readOnly
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>
          </div>
        </div>

        {/* EMI Options Section */}
        <div className="form-section">
          <h3>EMI Options</h3>
          <div className="form-row">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="emi.isAvailable"
                  checked={formData.emi.isAvailable}
                  onChange={handleChange}
                />
                Enable EMI for this course
              </label>
            </div>
          </div>
          {formData.emi.isAvailable && (
            <div className="form-row">
              <div className="form-group">
                <label>EMI Duration (Months):</label>
                <input
                  name="emi.emiDurationMonths"
                  type="number"
                  min="1"
                  value={formData.emi.emiDurationMonths}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Amount:</label>
                <input
                  name="emi.totalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.emi.totalAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Monthly Amount (Auto-calculated):</label>
                <input
                  name="emi.monthlyAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.emi.monthlyAmount}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Notes:</label>
                <textarea
                  name="emi.notes"
                  value={formData.emi.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Content Duration Section */}
        <div className="form-section">
          <h3>Content Duration</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Hours:</label>
              <input
                name="contentduration.hours"
                type="number"
                min="0"
                value={formData.contentduration.hours}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Minutes:</label>
              <input
                name="contentduration.minutes"
                type="number"
                min="0"
                max="59"
                value={formData.contentduration.minutes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Chapters & Lessons Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>Chapters & Lessons</h3>
            <button type="button" onClick={addNewChapter} className="btn-add">
              + Add Chapter
            </button>
          </div>

          {formData.chapters.map((chapter, chIdx) => (
            <div key={chIdx} className="chapter-card">
              <div className="chapter-header">
                <h4>Chapter {chIdx + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeChapter(chIdx)}
                  className="btn-remove"
                >
                  Remove Chapter
                </button>
              </div>

              <div className="form-group">
                <label>Chapter Title:</label>
                <input
                  value={chapter.title}
                  onChange={(e) =>
                    handleChapterChange(chIdx, "title", e.target.value)
                  }
                  required
                />
              </div>

              <div className="lessons-container">
                <div className="lessons-header">
                  <h5>Lessons</h5>
                  <button
                    type="button"
                    onClick={() => addNewLesson(chIdx)}
                    className="btn-add-sm"
                  >
                    + Add Lesson
                  </button>
                </div>

                {chapter.lessons?.map((lesson, lsIdx) => (
                  <div key={lsIdx} className="lesson-card">
                    <div className="lesson-header">
                      <h6>Lesson {lsIdx + 1}</h6>
                      <button
                        type="button"
                        onClick={() => removeLesson(chIdx, lsIdx)}
                        className="btn-remove-sm"
                      >
                        Remove Lesson
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Lesson Name:</label>
                      <input
                        value={lesson.lessonname}
                        onChange={(e) =>
                          handleLessonChange(
                            chIdx,
                            lsIdx,
                            "lessonname",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    {/* Custom File Names */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Audio File Name:</label>
                        <input
                          value={lesson.audioname}
                          onChange={(e) =>
                            handleLessonChange(
                              chIdx,
                              lsIdx,
                              "audioname",
                              e.target.value
                            )
                          }
                          placeholder="Custom name for audio file"
                        />
                      </div>
                      <div className="form-group">
                        <label>Video File Name:</label>
                        <input
                          value={lesson.videoname}
                          onChange={(e) =>
                            handleLessonChange(
                              chIdx,
                              lsIdx,
                              "videoname",
                              e.target.value
                            )
                          }
                          placeholder="Custom name for video file"
                        />
                      </div>
                      <div className="form-group">
                        <label>PDF File Name:</label>
                        <input
                          value={lesson.pdfname}
                          onChange={(e) =>
                            handleLessonChange(
                              chIdx,
                              lsIdx,
                              "pdfname",
                              e.target.value
                            )
                          }
                          placeholder="Custom name for PDF file"
                        />
                      </div>
                    </div>

                    {/* Audio Files */}
                    <div className="file-upload-group">
                      <label>Audio Files:</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) =>
                          handleFileChange(e, chIdx, lsIdx, "audio")
                        }
                        multiple
                      />
                      <div className="file-list">
                        {lesson.audioFile?.map((file, idx) => (
                          <div key={idx} className="file-item">
                            <span>{file.name || file.filename}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeMediaFile(chIdx, lsIdx, "audioFile", idx)
                              }
                              className="btn-remove-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Files */}
                    <div className="file-upload-group">
                      <label>Video Files:</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleFileChange(e, chIdx, lsIdx, "video")
                        }
                        multiple
                      />
                      <div className="file-list">
                        {lesson.videoFile?.map((file, idx) => (
                          <div key={idx} className="file-item">
                            <span>{file.name || file.filename}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeMediaFile(chIdx, lsIdx, "videoFile", idx)
                              }
                              className="btn-remove-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF Files */}
                    <div className="file-upload-group">
                      <label>PDF Files:</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFileChange(e, chIdx, lsIdx, "pdf")
                        }
                        multiple
                      />
                      <div className="file-list">
                        {lesson.pdfFile?.map((file, idx) => (
                          <div key={idx} className="file-item">
                            <span>{file.name || file.filename}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeMediaFile(chIdx, lsIdx, "pdfFile", idx)
                              }
                              className="btn-remove-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save All Changes"}
        </button>
      </form>

      <style jsx>{`
        .edit-course-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        textarea {
          min-height: 100px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chapter-card {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #eee;
          border-radius: 8px;
          background: white;
        }

        .chapter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .lessons-container {
          margin-top: 1.5rem;
        }

        .lessons-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .lesson-card {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px solid #f0f0f0;
          border-radius: 6px;
          background: #fdfdfd;
        }

        .lesson-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .file-upload-group {
          margin-bottom: 1rem;
        }

        .file-list {
          margin-top: 0.5rem;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }

        .btn-add,
        .btn-add-sm {
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 0.5rem 1rem;
          font-size: 1rem;
        }

        .btn-add-sm {
          padding: 0.3rem 0.6rem;
          font-size: 0.9rem;
        }

        .btn-remove,
        .btn-remove-sm,
        .btn-remove-xs {
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-remove {
          padding: 0.3rem 0.6rem;
        }

        .btn-remove-sm {
          padding: 0.2rem 0.4rem;
        }

        .btn-remove-xs {
          padding: 0.1rem 0.3rem;
          font-size: 0.8rem;
        }

        .btn-submit {
          width: 100%;
          padding: 1rem;
          background: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 1rem;
        }

        .btn-submit:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #f44336;
          background: #ffebee;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default EditCourse;
