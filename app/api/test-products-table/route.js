import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // تست اتصال و وجود جدول
    const testQuery = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    `;
    
    const tableExists = testQuery && testQuery.length > 0;
    
    // تست query ساده
    let productCount = 0;
    let canQuery = false;
    
    if (tableExists) {
      try {
        productCount = await prisma.product.count();
        canQuery = true;
      } catch (queryError) {
        console.error("Error querying products:", queryError);
      }
    }
    
    return NextResponse.json({
      success: true,
      tableExists,
      canQuery,
      productCount,
      message: tableExists 
        ? "✅ جدول products وجود دارد" 
        : "❌ جدول products وجود ندارد",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      message: "❌ خطا در بررسی جدول",
    }, { status: 500 });
  }
}

