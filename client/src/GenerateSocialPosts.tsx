import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import  Video from "./Video";
import { InputForm } from "./InputForm";
import { Result } from "./Result";
import "./GenerateSocialPosts.css";
import { useGetVideo } from "./apiHooks";
import { keys } from "./keys";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";

const greenWarningIcon:string = require("./Warning_Green.svg").default;

/** Generate Titles and Hashtags
 *
 * App -> GenerateSocialPosts -> {VideoFileUploadForm, Video, InputForm, Result}
 *
 */

interface GenerateSocialPostsProps {
  index: string;
  videoId: string;
  refetchVideos: () => void;
}

export const GenerateSocialPosts:React.FC<GenerateSocialPostsProps> = ({ index, videoId, refetchVideos }) => {
  const { data: video, isLoading } = useGetVideo(
    index,
    videoId,
    Boolean(videoId)
  );

  const [prompt, setPrompt] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showVideoTitle, setShowVideoTitle] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [platform, setPlatform] = useState("");

  const queryClient = useQueryClient();

  const vidTitleRaw = video?.system_metadata?.filename;
  const vidTitleClean = decodeAndCleanFilename(vidTitleRaw);

  /** Return clean video file name  */
  function decodeAndCleanFilename(filename:string) {
    let decodedFilename = filename;
    try {
      decodedFilename = decodeURIComponent(filename);
    } catch (error) {
      console.error("Error decoding filename:", error);
    }
    const cleanedFilename = decodedFilename
      .replace(/%20/g, " ")
      .replace(/\([^)]*\)/g, "");
    return cleanedFilename;
  }

  async function resetPrompt() {
    setPrompt("");
  }

  useEffect(() => {
    const fetchData = async () => {
      await queryClient.invalidateQueries({
        queryKey: [keys.VIDEOS, index, videoId],
      });
    };
    fetchData();
    resetPrompt();
    setIsSubmitted(false);
    setShowVideoTitle(true);
    setSelectedFile(null);
    setIsFileUploading(false);
    setPlatform("")
  }, [index, videoId, queryClient]);

  return (
    <div className="GenerateSocialPosts">
      <h1 className="GenerateSocialPosts__appTitle">
        Generate Social Posts for Your Video
      </h1>
      <ErrorBoundary>
            {isLoading && <LoadingSpinner />}
            {!isLoading && !video && (
            <div className="GenerateSocialPosts__uploadMessageWrapper">
          <img
            className="GenerateSocialPosts__uploadMessageWrapper__warningIcon"
            src={greenWarningIcon}
            alt="greenWarningIcon"
          ></img>
          <div>
            <p className="GenerateSocialPosts__uploadMessageWrapper__message">
              Please upload a video
            </p>
          </div>
        </div>
            )}
      {!isFileUploading && (
        <>

            {video && (
              <Video
                url={video.hls?.video_url}
                width={"381px"}
                height={"214px"}
              />
            )}
          {showVideoTitle && (
            <div className="GenerateSocialPosts__videoTitle">
              {vidTitleClean}
            </div>
          )}
          {video && (
            <InputForm
              video={video}
              setIsSubmitted={setIsSubmitted}
              isSubmitted={isSubmitted}
              setShowVideoTitle={setShowVideoTitle}
              setPrompt={setPrompt}
              setPlatform={setPlatform}
            />
          )}
          {video && (
            <Result video={video} isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} prompt={prompt} platform={platform} />
          )}
        </>
      )}
      </ErrorBoundary>
    </div>
  );
}
