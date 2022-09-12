using System;
using Xunit;
using DiscussipediA.Controllers;
using DiscussipediA.Models;
using DiscussipediA.Repos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Linq;
using System.Collections;
using System.Collections.Generic;

namespace DiscussipediA.Tests
{
    public class ControllerTests
    {
        //Some Integration and unit tests do not work because
        //the controller references the database directly


        //Integration Tests

        //not working
        [Fact]
        public void SubjectsControllerIndexHasSubjects()
        {
            discussipediaContext _context = new discussipediaContext();

            var subjectsController = new SubjectsController(_context);
            var viewResult = Assert.IsType<ViewResult>(subjectsController.Index(null, null, null));
            var model = Assert.IsType<DiscussipediA.Models.PaginatedList<DiscussipediA.Models.Subject>>(viewResult.Model);
            int subjectCount = model.Count;
            Assert.True(subjectCount >= 1, "The subjects controler index page does not have at least one subject");
        }

        //Unit Tests

        [Fact]
        public void UnitTestPaginatedList()
        {
            List<Discussion> discussionList = new List<Discussion>()
            {
                new Discussion(),
                new Discussion(),
                new Discussion(),
                new Discussion(),
                new Discussion(),
            };

            IQueryable<Discussion> source = discussionList.AsQueryable();
            int pageIndex = 2;
            int pageSize = 3;

            var paginatedList = PaginatedList<Discussion>.Create(source, pageIndex, pageSize);

            // Ensure the create method creates a paginated list
            Assert.IsType<PaginatedList<Discussion>>(paginatedList);

            // Ensure create returns expected amount of elements 
            // (page size or remainder if last page)
            int expectedCount = 2;
            int actualCount = paginatedList.Count;
            Assert.Equal(expectedCount, actualCount);

            // Ensure HasPreviousPage is true when there's a previous page
            Assert.True(paginatedList.HasPreviousPage);

            // Ensure HasNextPage is false when there's no next page
            Assert.False(paginatedList.HasNextPage);

            // Ensure 
        }

        //[Fact]
        //public void UnitTestSubjectsControllerIndex()
        //{
        //    // 1. Create instance of fake repo using IProductRepository interface.
        //    var mockDiscussipediaContext = new Mock<discussipediaContext>();

        //    // 2. Set up return data for ProductList() method.
        //    mockDiscussipediaContext.Setup(mpr => mpr.ProductList())
        //        .Returns(new List<Product>{
        //            new Product(), new Product(), new Product()
        //        });

        //    // 3. Define controller instance with mock repository instance.
        //    var controller = new HomeController(mockDiscussipediaContext.Object);

        //    // 4. Make your test Assertions 
        //    // Check if it returns a view
        //    var result = Assert.IsType<ViewResult>(controller.Index());

        //    // Check that the model returned to the view is 'List<Product>'.
        //    var model = Assert.IsType<List<Product>>(result.Model);

        //    // Ensure count of objects is 3.
        //    int expected = 3;
        //    int actual = model.Count;
        //    Assert.Equal(expected, actual);
        //}
    }
}
