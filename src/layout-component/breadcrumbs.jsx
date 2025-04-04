import React from 'react';
import {Breadcrumbs, BreadcrumbItem} from "@heroui/react";

const BreadcrumbsComponent = ({ arr }) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) {
    console.warn("The 'arr' prop is invalid or empty.");
    return null;
  }

  const arrWithoutFirst = arr.slice(1);
  return (
    <Breadcrumbs
      itemsAfterCollapse={2}
      itemsBeforeCollapse={1}
      maxItems={3}
      classNames={{
        list: "bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] shadow-small",
      }}
      itemClasses={{
        item: "text-white/80 data-[current=true]:text-white",
        separator: "text-white/70",
      }}
      underline="always"
      variant="solid"
    >
      {arrWithoutFirst.map((segment, index) => {
        const pathUpToSegment = '/super-admin/' + arrWithoutFirst.slice(0, index + 1).join('/');
        // Remove hyphens and capitalize words
        const displayText = segment
        .split('-') // Split words by hyphen
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join the words back with a space
        return (
          index + 1 < arrWithoutFirst.length ? (
            <BreadcrumbItem key={pathUpToSegment} href={pathUpToSegment}>
              {displayText}
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem key={pathUpToSegment}>
              {displayText}
            </BreadcrumbItem>
          )
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
