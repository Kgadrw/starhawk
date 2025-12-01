import { HOMEPAGE_COLORS, HOMEPAGE_SPACING } from "@/constants/homepage";

export function FeaturesSection() {
   return (
     <section className={`relative ${HOMEPAGE_COLORS.bgWhite} p-4 pt-4 sm:pt-6 md:pt-8 mb-4 sm:mb-6 md:mb-8`}>
       <div className={`${HOMEPAGE_SPACING.maxWidth}`}>
        {/* This section can be used for other features in the future */}
      </div>
    </section>
  );
}