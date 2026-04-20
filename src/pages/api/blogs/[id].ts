import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "blogs.json");

function readBlogs(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
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
  const { id } = req.query;
  const blogId = Number(id);

  if (isNaN(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  if (req.method === "GET") {
    const blogs = readBlogs();
    const blog = blogs.find((b: any) => b.id === blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.status(200).json(blog);
  }

  if (req.method === "PUT") {
    const blogs = readBlogs();
    const index = blogs.findIndex((b: any) => b.id === blogId);
    if (index === -1) return res.status(404).json({ message: "Blog not found" });

    const body = req.body;
    blogs[index] = {
      ...blogs[index],
      title: body.title ?? blogs[index].title,
      category: body.category ?? blogs[index].category,
      date: body.date ?? blogs[index].date,
      description: body.description ?? blogs[index].description,
      content: body.content ?? blogs[index].content,
      image: body.image ?? blogs[index].image,
      tags: body.tags ?? blogs[index].tags,
      updatedAt: new Date().toISOString(),
    };

    writeBlogs(blogs);
    return res.status(200).json(blogs[index]);
  }

  if (req.method === "DELETE") {
    let blogs = readBlogs();
    const exists = blogs.some((b: any) => b.id === blogId);
    if (!exists) return res.status(404).json({ message: "Blog not found" });

    blogs = blogs.filter((b: any) => b.id !== blogId);
    writeBlogs(blogs);
    return res.status(200).json({ message: "Blog deleted successfully" });
  }

  res.setHeader("Allow", "GET, PUT, DELETE");
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
