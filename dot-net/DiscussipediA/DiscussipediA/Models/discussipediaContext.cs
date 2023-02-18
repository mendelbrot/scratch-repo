using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DiscussipediA.Models
{
    public partial class discussipediaContext : DbContext
    {
        public discussipediaContext()
        {
        }

        public discussipediaContext(DbContextOptions<discussipediaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Discussion> Discussion { get; set; }
        public virtual DbSet<Post> Post { get; set; }
        public virtual DbSet<Subject> Subject { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Discussion>(entity =>
            {
                entity.ToTable("discussion");

                entity.Property(e => e.DiscussionId).HasColumnName("discussion_id");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.Property(e => e.SubjectId).HasColumnName("subject_id");

                entity.HasOne(d => d.Subject)
                    .WithMany(p => p.Discussion)
                    .HasForeignKey(d => d.SubjectId)
                    .HasConstraintName("FK__discussio__subje__398D8EEE");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.ToTable("post");

                entity.Property(e => e.PostId).HasColumnName("post_id");

                entity.Property(e => e.Content)
                    .HasColumnName("content")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Datetime)
                    .HasColumnName("datetime")
                    .HasColumnType("datetime");

                entity.Property(e => e.DiscussionId).HasColumnName("discussion_id");

                entity.Property(e => e.Username)
                    .HasColumnName("username")
                    .HasMaxLength(25)
                    .IsUnicode(false);

                entity.HasOne(d => d.Discussion)
                    .WithMany(p => p.Post)
                    .HasForeignKey(d => d.DiscussionId)
                    .HasConstraintName("FK__post__discussion__3C69FB99");
            });

            modelBuilder.Entity<Subject>(entity =>
            {
                entity.ToTable("subject");

                entity.Property(e => e.SubjectId).HasColumnName("subject_id");

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(25)
                    .IsUnicode(false);
            });
        }
    }
}
