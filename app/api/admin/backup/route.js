import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createBackup } from "@/scripts/backup";
import { prisma } from "@/lib/prisma";
const path = require('path');

// GET - List available backups
export async function GET() {
  try {
    await requireAdmin();

    const fs = require('fs');
    const path = require('path');

    const backupDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
      .map(file => {
        const filepath = path.join(backupDir, file);
        const stats = fs.statSync(filepath);

        return {
          filename: file,
          size: stats.size,
          createdAt: stats.mtime,
          path: `/backups/${file}`, // For download
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error("Error listing backups:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در دریافت لیست پشتیبان‌ها" },
      { status: 500 }
    );
  }
}

// POST - Create new backup
export async function POST() {
  try {
    await requireAdmin();

    // Create backup
    const backupPath = await createBackup();

    // Log the backup creation
    await prisma.logEntry.create({
      data: {
        timestamp: new Date(),
        level: "INFO",
        message: `Database backup created: ${path.basename(backupPath)}`,
        context: JSON.stringify({
          type: "backup_created",
          path: backupPath,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "پشتیبان‌گیری با موفقیت انجام شد",
      data: {
        path: backupPath,
        filename: path.basename(backupPath),
      },
    });
  } catch (error) {
    console.error("Error creating backup:", error);

    if (error.message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "خطا در ایجاد پشتیبان" },
      { status: 500 }
    );
  }
}
