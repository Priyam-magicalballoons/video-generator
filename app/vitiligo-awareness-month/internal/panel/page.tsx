"use client";

import { getAllDoctorIpledges, getAllDoctorPosters, getAllDoctorVideos, updateUrl } from "@/app/actions/other.actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx";


const Page = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [report, setReport] = useState<"video" | "poster" | "i-pledge">("video")
  const [loading, setLoading] = useState(false)

  const getAllVideoData = async () => {
    setLoading(true)
    const data = await getAllDoctorVideos();
    setAllData(data || []);
    setLoading(false)
  };

  const getAllPosterData = async ()=> {
    setLoading(true)
    const data = await getAllDoctorPosters();
    setAllData(data || []);
    setLoading(false)
  }
  
  const getAllIPledgeData = async ()=> {
    setLoading(true)
    const data = await getAllDoctorIpledges();
    console.log(data)
    setAllData(data || []);
    setLoading(false)
  }


  const handleDownload = async (file: string, filename: string) => {
    try {
      const res = await fetch(file);
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) throw new Error("Failed to fetch file");

      const extensionMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/bmp": ".bmp",
        "image/tiff": ".tiff",
        "image/svg+xml": ".svg",
        "image/x-icon": ".ico",
        "video/mp4": ".mp4",
        "application/pdf": ".pdf",
      };

      const extension = extensionMap[contentType] || "";
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${filename}${extension}`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  };

  const uploadVideo = async (e: ChangeEvent<HTMLInputElement>, item: any) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("video/")) {
    toast("Kindly upload a valid video file.");
    return;
  }

  try {
    const videoId = item.id
    setUploadingIds((prev) => new Set(prev).add(videoId));

    const folderName = "doctor-videos";
    const filenameWithFolder = `${folderName}/region - ${item.mr.region}/HQ - ${item.mr.Hq}/${item.mr.name}/${item.doctor.name}/${item.doctor.name}.mp4`;


    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/presign?filename=${encodeURIComponent(filenameWithFolder)}&type=${encodeURIComponent(file.type)}`);
    const { url } = await res.json();

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      toast("Upload failed. Please try again.");
      setUploadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
      return;
    }

    const cleanUrl = url.split("?")[0];
    const update = await updateUrl(videoId, cleanUrl);

   if (update?.data?.url) {
  setAllData((prev) =>
    prev.map((item) =>
      item.id === videoId ? { ...item, url: update.data.url } : item
    )
  );
  setUploadingIds((prev) => {
    const newSet = new Set(prev);
    newSet.delete(videoId);
    return newSet;
  });
  toast.success("Video uploaded successfully");
}

  } catch (error) {
    console.error(error);
    setUploadingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(item.id);
      return newSet;
    });
  }
};


  function exportTableToExcel(
  tableId: string,
  fileName: string = "export.xlsx",
  columnsToRemove: number[] = []
) {
  const table = document.getElementById(tableId) as HTMLTableElement;
  if (!table) {
    console.error("Table not found:", tableId);
    return;
  }

  // Clone the table so we don't modify the DOM
  const tableClone = table.cloneNode(true) as HTMLTableElement;

  // Remove specified columns from all rows
  Array.from(tableClone.rows).forEach((row) => {
    columnsToRemove
      .sort((a, b) => b - a) // Remove from end to avoid shifting
      .forEach((colIndex) => {
        if (row.cells[colIndex]) row.deleteCell(colIndex);
      });
  });

  // Convert to worksheet and workbook
  const ws = XLSX.utils.table_to_sheet(tableClone);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Export to Excel file
  XLSX.writeFile(wb, fileName);
}

  useEffect(() => {
    console.log(report)
    if(report === "video"){
      getAllVideoData();
    }else if(report === "poster"){
      getAllPosterData()
    }else if(report === "i-pledge"){
       getAllIPledgeData()
      
    }
  }, [report]);

  return (
    <div className="w-full h-screen flex flex-col">
  <div className="flex flex-wrap justify-between items-center px-4 py-4 gap-2">
    <div>
      <Select onValueChange={(e) => setReport(e as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="video" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="poster">Poster</SelectItem>
          <SelectItem value="i-pledge">I-pledge</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <h2 className="text-2xl md:text-4xl text-center font-serif font-semibold tracking-wider">
      All Doctors Data
    </h2>

    <div>
      <Button
        onClick={() =>
          exportTableToExcel(
            "doctor-table",
            `${
              report === "video"
                ? "video-table.xlsx"
                : report === "poster"
                ? "poster-table.xlsx"
                : "i-pledge-table.xlsx"
            }`,
            [9]
          )
        }
      >
        Export To Excel
      </Button>
    </div>
  </div>

  {!loading ? (
    <div className="flex-1 overflow-auto px-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[800px] w-full text-sm text-left border-collapse" id="doctor-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Mr Name</th>
              <th className="border px-4 py-2">Mr Id</th>
              <th className="border px-4 py-2">Region</th>
              <th className="border px-4 py-2">Designation</th>
              <th className="border px-4 py-2">HQ</th>
              <th className="border px-4 py-2">Doctor name</th>
              <th className="border px-4 py-2">
                {report === "video"
                  ? "Image url"
                  : report === "poster"
                  ? "Poster 1 url"
                  : "i-pledge url"}
              </th>
              <th className={`border px-4 py-2 ${report === "i-pledge" ? "hidden" : ""}`}>
                {report === "video" ? "Video url" : report === "poster" ? "Poster 2 url" : ""}
              </th>
              <th className={`border px-4 py-2 ${report !== "video" ? "hidden" : ""}`}>
                Upload Video
              </th>
            </tr>
          </thead>
          <tbody>
            {allData?.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item?.mr?.name}</td>
                <td className="border px-4 py-2">{item?.mr?.mid}</td>
                <td className="border px-4 py-2">{item?.mr?.region}</td>
                <td className="border px-4 py-2">{item?.mr?.desg}</td>
                <td className="border px-4 py-2">{item?.mr?.Hq}</td>
                <td className="border px-4 py-2">{item?.doctor?.name}</td>
                <td className="border px-4 py-2 text-blue-600 max-w-[200px] truncate cursor-pointer">
                  <p
                    onClick={() =>
                      handleDownload(
                        `${
                          report === "video"
                            ? item.refImageUrl
                            : report === "poster"
                            ? item?.url_1
                            : item?.url
                        }`,
                        `${item?.doctor.name}-${report === "video" ? "image" : report === "poster" ? "poster_1" : "i-pledge"}`
                      )
                    }
                  >
                    {report === "video"
                      ? item.refImageUrl
                      : report === "poster"
                      ? item?.url_1
                      : item?.url}
                  </p>
                </td>
                <td
                  className={`border px-4 py-2 text-blue-600 max-w-[200px] truncate cursor-pointer ${
                    report === "i-pledge" ? "hidden" : ""
                  }`}
                >
                  <p
                    onClick={() =>
                      handleDownload(
                        `${
                          report === "video"
                            ? item.refVideoUrl
                            : report === "poster"
                            ? item?.url_2
                            : ""
                        }`,
                        `${item?.doctor.name}-${report === "video" ? "video" : report === "poster" ? "poster_2" : "i-pledge"}`
                      )
                    }
                  >
                    {report === "video"
                      ? item.refVideoUrl
                      : report === "poster"
                      ? item?.url_2
                      : ""}
                  </p>
                </td>
                <td className={`border px-4 py-2 ${report !== "video" ? "hidden" : ""}`}>
                  {item.url ? (
                    <a
                      className="text-blue-600 max-w-[200px] truncate flex"
                      href={item.url}
                      target="_blank"
                    >
                      {item.url}
                    </a>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="video/*"
                        id={`upload-${item.id}`}
                        hidden
                        onChange={(e) => uploadVideo(e, item)}
                      />
                      <Button
                        type="button"
                        onClick={() => document.getElementById(`upload-${item.id}`)?.click()}
                      >
                        {uploadingIds.has(item.id) ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <span>Uploading</span>
                          </div>
                        ) : (
                          "Upload Video"
                        )}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full gap-2">
      <Loader2 className="animate-spin" />
      <p>Loading...</p>
    </div>
  )}
</div>

  );
};

export default Page;