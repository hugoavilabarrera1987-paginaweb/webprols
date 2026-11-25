"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./EditorialPages.module.css";

type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  summary: string;
  isFeatured: boolean;
  image: { url: string; alt_text: string } | null;
  href: string;
};

export default function PortfolioProjectGrid({
  projects,
  isManaged,
}: {
  projects: PortfolioProject[];
  isManaged: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(projects.map((project) => project.category)));
  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : projects;

  return (
    <>
      {categories.length > 1 && (
        <div className={styles.projectFilterBar}>
          <div className={styles.projectFilters} role="group" aria-label="Filtrar proyectos por categoría">
            <button
              className={`${styles.projectFilter} ${selectedCategory === null ? styles.projectFilterActive : ""}`}
              type="button"
              aria-pressed={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                className={`${styles.projectFilter} ${selectedCategory === category ? styles.projectFilterActive : ""}`}
                type="button"
                aria-pressed={selectedCategory === category}
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className={styles.projectCount} aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
          </p>
        </div>
      )}
      <div className={styles.projectGrid}>
        {filteredProjects.map((project) => (
          <article className={styles.projectCard} key={project.id}>
            <Link className={styles.projectVisualLink} href={project.href} aria-label={`Ver ${project.title}`}>
              {project.image ? (
                <Image
                  className={styles.projectImage}
                  src={project.image.url}
                  alt={project.image.alt_text || project.title}
                  width={760}
                  height={440}
                  sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1212px) calc((100vw - 68px) / 3), 381px"
                  quality={75}
                />
              ) : (
                <div className={styles.projectArtwork} aria-hidden="true">
                  <div className={styles.projectBrowser}>
                    <span><i /><i /><i /></span>
                    <b>{project.category}</b>
                    <div><i /><i /><i /></div>
                  </div>
                  <div className={styles.projectAbstract}>
                    <span /><span /><span />
                  </div>
                </div>
              )}
              {project.isFeatured && <span className={styles.featuredBadge}>Destacado</span>}
              <span className={styles.projectViewIcon}><ArrowUpRight size={19} /></span>
            </Link>
            <div className={styles.projectInfo}>
              <span className={styles.projectCategory}>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <Link className={styles.projectLink} href={project.href}>
                {isManaged ? "Ver proyecto" : "Consultar proyecto"}
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
