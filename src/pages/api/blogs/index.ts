import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");

function readBlogs(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, "[]", "utf-8");
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBlogs(blogs: any[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2), "utf-8");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const blogs = readBlogs();
    return res.status(200).json(blogs);
  }

  if (req.method === "POST") {
    const blogs = readBlogs();
    const body = req.body;

    // Generate next ID: start from 1000 to avoid collisions with hardcoded articles
    const maxId = blogs.reduce((max: number, b: any) => Math.max(max, b.id || 0), 999);
    const newBlog = {
      id: maxId + 1,
      title: body.title || "",
      category: body.category || "ARTICLES",
      date: body.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      description: body.description || "",
      content: body.content || "",
      image: body.image || "",
      tags: body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    blogs.unshift(newBlog); // newest first
    writeBlogs(blogs);

    return res.status(201).json(newBlog);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
