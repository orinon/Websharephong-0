'use client';

import React from "react";
import { IconType } from "react-icons";

// Interface định nghĩa các props của component CategoryView
interface CategoryViewProps {
  icon: IconType;
  label: string;
  description: string;
}

// Component cơ bản
const CategoryView: React.FC<CategoryViewProps> = ({ icon: Icon, label, description }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon size={40} className="text-neutral-600" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{label}</div>
          <div className="text-neutral-500 font-light">{description}</div>
        </div>
      </div>
    </div>
  );
};

// Decorator để thêm hiệu ứng hoạt hình
const withAnimation = (WrappedComponent: React.FC<CategoryViewProps>): React.FC<CategoryViewProps> => {
  return ({ ...props }) => {
    return (
      <div className="animate-bounce">
        <WrappedComponent {...props} />
      </div>
    );
  };
};

// Decorator để thêm phong cách bổ sung
const withStyle = (WrappedComponent: React.FC<CategoryViewProps>): React.FC<CategoryViewProps> => {
  return ({ ...props }) => {
    return (
      <div style={{ border: "1px solid gray", padding: "10px", borderRadius: "5px" }}>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

// Component được trang trí với hiệu ứng hoạt hình và phong cách bổ sung
const DecoratedCategoryView = withStyle(withAnimation(CategoryView));

export default DecoratedCategoryView;
// 'use client';

// import { IconType } from "react-icons";

// interface CategoryViewProps {
//   icon: IconType,
//   label: string,
//   description: string
// }

// const CategoryView: React.FC<CategoryViewProps> = ({ 
//   icon: Icon,
//   label,
//   description
//  }) => {
//   return ( 
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-row items-center gap-4">
//         <Icon size={40} className="text-neutral-600" />
//         <div className="flex flex-col">
//             <div 
//               className="text-lg font-semibold"
//             >
//               {label}
//             </div>
//             <div 
//               className="text-neutral-500 font-light"
//             >
//               {description}
//             </div>
//         </div>
//       </div>
//     </div>
//    );
// }
 
// export default CategoryView;