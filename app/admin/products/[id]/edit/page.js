"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";
import { colorMap } from "@/utils/colorMap";
import { useToast } from "@/components/providers/ToastProvider";
import ProductFormHeader from "@/components/admin/ProductFormHeader";
import ProductBasicInfo from "@/components/admin/product/ProductBasicInfo";
import ProductImagesSection from "@/components/admin/product/ProductImagesSection";
import ProductPricingSection from "@/components/admin/product/ProductPricingSection";
import ProductVariantsSection from "@/components/admin/product/ProductVariantsSection";
import ProductAdditionalInfo from "@/components/admin/product/ProductAdditionalInfo";
import ProductSizeChartSection from "@/components/admin/product/ProductSizeChartSection";
import { useProductForm } from "@/hooks/useProductForm";
import { useProductImages } from "@/hooks/useProductImages";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useProductFeatures } from "@/hooks/useProductFeatures";
import { useProductSizeChart } from "@/hooks/useProductSizeChart";
import { getAvailableSizes } from "@/utils/productHelpers";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id;
  const { showToast } = useToast();

  // Main form hook
  const { formData, setFormData, isLoading, isSaving, isAuthorized, handleSubmit } =
    useProductForm(productId, true);

  // Image management hook
  const imagesData = useProductImages(formData, setFormData, showToast);

  // Variants management hook
  const variantsData = useProductVariants(formData, setFormData);

  // Features management hook
  const featuresData = useProductFeatures(formData, setFormData);

  // Size chart management hook
  const sizeChartData = useProductSizeChart(formData, setFormData);

  const availableSizes = getAvailableSizes(formData.category);
  const allColors = Object.keys(colorMap);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductFormHeader title="ویرایش محصول" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <ProductBasicInfo
            formData={formData}
            setFormData={setFormData}
            getAvailableSizes={getAvailableSizes}
          />

          <ProductImagesSection
            formData={formData}
            setFormData={setFormData}
            newImage={imagesData.newImage}
            setNewImage={imagesData.setNewImage}
            uploadingImage={imagesData.uploadingImage}
            uploadingImages={imagesData.uploadingImages}
            onImageUpload={imagesData.handleImageUpload}
            onAddImage={imagesData.addImage}
            onRemoveImage={imagesData.removeImage}
          />

          <ProductPricingSection formData={formData} setFormData={setFormData} />

          <ProductVariantsSection
            formData={formData}
            setFormData={setFormData}
            availableSizes={availableSizes}
            allColors={allColors}
            onToggleSize={variantsData.toggleSize}
            onToggleColor={variantsData.toggleColor}
            onUpdateVariantStock={variantsData.updateVariantStock}
          />

          <ProductAdditionalInfo
            formData={formData}
            setFormData={setFormData}
            newFeature={featuresData.newFeature}
            setNewFeature={featuresData.setNewFeature}
            onAddFeature={featuresData.addFeature}
            onRemoveFeature={featuresData.removeFeature}
          />

          <ProductSizeChartSection
            formData={formData}
            setFormData={setFormData}
            newSizeChart={sizeChartData.newSizeChart}
            setNewSizeChart={sizeChartData.setNewSizeChart}
            onAddSizeChart={sizeChartData.addSizeChart}
            onRemoveSizeChart={sizeChartData.removeSizeChart}
          />

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              انصراف
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

